import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Image,
  Platform,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Share from 'react-native-share';

const audioRecorderPlayer = AudioRecorderPlayer;

interface VoiceToMemeResult {
  imageUrl: string;
  transcript: string;
  caption: string;
}

export default function VoiceToMemeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VoiceToMemeResult | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;

  // Demande permission au chargement
  useEffect(() => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    request(permission).then(status => {
      if (status !== RESULTS.GRANTED) {
        Alert.alert('Permission refusée', 'Le micro est requis.');
      }
    });
  }, []);

  // Animation pulsation
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 500, useNativeDriver: true }),
      ])
    ).start();
  };

  const startRecording = async () => {
    setIsRecording(true);
    startPulse();
    await audioRecorderPlayer.startRecorder();
  };

  const stopRecording = async () => {
    const path = await audioRecorderPlayer.stopRecorder();
    setIsRecording(false);
    pulse.stopAnimation();
    sendAudio(path);
  };

  const sendAudio = async (path: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', { uri: path, type: 'audio/mp4', name: 'voice.mp4' });

      const res = await fetch('http://192.168.x.x:3000/api/voice-to-meme', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const share = () => {
    if (!result) {
      return;
    }

    Share.open({ url: result.imageUrl, message: result.caption });
  };

  return (
    <View>
      {/* Bouton enregistrement */}
      {isRecording ? (
        <>
          <Animated.View style={{ transform: [{ scale: pulse }],
            width: 80, height: 80, borderRadius: 40, backgroundColor: 'red' }} />
          <Button title="Arrêter" onPress={stopRecording} />
        </>
      ) : (
        <Button title="Enregistrer" onPress={startRecording} />
      )}

      {/* Chargement */}
      {isLoading && <ActivityIndicator />}

      {/* Résultat */}
      {result && (
        <>
          <Image source={{ uri: result.imageUrl }} style={{ width: 300, height: 300 }} />
          <Text>{result.transcript}</Text>
          <Button title="Partager" onPress={share} />
        </>
      )}
    </View>
  );
}