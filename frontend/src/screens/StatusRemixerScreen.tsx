import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
  ScrollView, Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BACKEND_URL } from '../config';

interface MemeResult {
  captionTop: string;
  captionBottom: string;
}

const StatusRemixerScreen = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendImageToBackend = async (image: any) => {
    if (!image.uri) { Alert.alert('Erreur', 'Image invalide.'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        type: image.type || 'image/jpeg',
        name: image.fileName || 'meme.jpg',
      } as any);
      const response = await fetch(`${BACKEND_URL}/api/status-remixer`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
      const data: MemeResult = await response.json();
      setMemeResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setMemeResult(null);
        sendImageToBackend(response.assets[0]);
      }
    });
  };

  const handleOpenGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setMemeResult(null);
        sendImageToBackend(response.assets[0]);
      }
    });
  };

  const handleReset = () => { setSelectedImage(null); setMemeResult(null); };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🖼️ Status Remixer</Text>
      <Text style={styles.subtitle}>Choisis une image, l'IA génère le meme !</Text>

      {!selectedImage && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleOpenCamera}>
            <Text style={styles.btnText}>📷 Caméra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleOpenGallery}>
            <Text style={styles.btnText}>🖼️ Galerie</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedImage && (
        <View style={styles.memeContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.memeImage} resizeMode="cover" />
          {memeResult && <Text style={[styles.memeText, styles.memeTextTop]}>{memeResult.captionTop}</Text>}
          {memeResult && <Text style={[styles.memeText, styles.memeTextBottom]}>{memeResult.captionBottom}</Text>}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>L'IA analyse... 🤖</Text>
            </View>
          )}
        </View>
      )}

      {memeResult && !loading && (
        <TouchableOpacity style={[styles.btnReset, { marginTop: 20 }]} onPress={handleReset}>
          <Text style={styles.btnText}>🔄 Recommencer</Text>
        </TouchableOpacity>
      )}

      {selectedImage && !loading && !memeResult && (
        <TouchableOpacity style={[styles.btnReset, { marginTop: 16 }]} onPress={handleReset}>
          <Text style={styles.btnText}>← Autre image</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1a1a2e', alignItems: 'center', padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', marginTop: 20, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 30, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  btnPrimary: { backgroundColor: '#e94560', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  btnSecondary: { backgroundColor: '#0f3460', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, borderWidth: 2, borderColor: '#e94560' },
  btnReset: { backgroundColor: '#6c757d', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  memeContainer: { width: '100%', position: 'relative', borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
  memeImage: { width: '100%', height: 320 },
  memeText: { position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontWeight: '900', fontSize: 20, paddingHorizontal: 10, paddingVertical: 6, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, textTransform: 'uppercase' },
  memeTextTop: { top: 10, backgroundColor: 'rgba(0,0,0,0.35)' },
  memeTextBottom: { bottom: 10, backgroundColor: 'rgba(0,0,0,0.35)' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFD700', marginTop: 12, fontWeight: 'bold' },
});

export default StatusRemixerScreen;
