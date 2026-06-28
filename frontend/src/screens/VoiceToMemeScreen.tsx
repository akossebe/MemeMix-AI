import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { BACKEND_URL } from '../config';

const VoiceToMemeScreen = () => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setResult({
          transcript: 'Fonctionnalité vocale disponible après installation de react-native-audio-recorder-player',
          caption: 'QUAND LE MICRO EST PAS ENCORE PRÊT 😂',
        });
      }, 1500);
    } else {
      setRecording(true);
    }
  };

  const handleReset = () => { setResult(null); setRecording(false); };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎙️ Voice to Meme</Text>
      <Text style={styles.subtitle}>Enregistre ta voix, l'IA génère le meme !</Text>

      {!result && (
        <TouchableOpacity
          style={[styles.recordBtn, recording && styles.recordBtnActive]}
          onPress={handleRecord}
        >
          <Text style={styles.recordIcon}>{recording ? '⏹️' : '🎙️'}</Text>
          <Text style={styles.recordText}>{recording ? 'Arrêter' : 'Enregistrer'}</Text>
        </TouchableOpacity>
      )}

      {recording && (
        <View style={styles.pulseContainer}>
          <View style={styles.pulse} />
          <Text style={styles.pulseText}>Enregistrement en cours...</Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>L'IA analyse ta voix... 🤖</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.transcript}>🗣️ "{result.transcript}"</Text>
          <View style={styles.memeBox}>
            <Text style={styles.caption}>{result.caption}</Text>
          </View>
          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Text style={styles.btnText}>🔄 Recommencer</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1a1a2e', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', marginTop: 20, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 30, textAlign: 'center' },
  recordBtn: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#0f3460', borderWidth: 3, borderColor: '#e94560', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  recordBtnActive: { backgroundColor: '#e94560', borderColor: '#FFD700' },
  recordIcon: { fontSize: 48 },
  recordText: { color: '#fff', fontWeight: 'bold', marginTop: 8, fontSize: 16 },
  pulseContainer: { alignItems: 'center', marginBottom: 20 },
  pulse: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e94560', marginBottom: 8 },
  pulseText: { color: '#e94560', fontWeight: 'bold' },
  loadingContainer: { alignItems: 'center', marginTop: 20 },
  loadingText: { color: '#FFD700', marginTop: 12, fontWeight: 'bold' },
  resultBox: { width: '100%', alignItems: 'center', marginTop: 10 },
  transcript: { color: '#aaa', fontSize: 14, fontStyle: 'italic', marginBottom: 16, textAlign: 'center' },
  memeBox: { width: '100%', backgroundColor: '#0f3460', borderRadius: 12, padding: 20, borderWidth: 2, borderColor: '#e94560', marginBottom: 20 },
  caption: { color: '#FFD700', fontSize: 20, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  btnReset: { backgroundColor: '#6c757d', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default VoiceToMemeScreen;
