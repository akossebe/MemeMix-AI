import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { BACKEND_URL } from '../config';

const ContextReaderScreen = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Erreur', 'Colle un texte avant de générer.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/context-reader`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
        },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setInputText(''); };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💬 Context Reader</Text>
      <Text style={styles.subtitle}>Colle un texte, l'IA génère le meme !</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        placeholder="Colle ici ton extrait de discussion..."
        placeholderTextColor="#666"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.btn} onPress={handleGenerate} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>�� Générer le meme</Text>}
      </TouchableOpacity>
      {result && (
        <View style={styles.resultBox}>
          <View style={styles.memeBox}>
            <Text style={styles.caption}>{result.caption || JSON.stringify(result)}</Text>
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
  container: { flexGrow: 1, backgroundColor: '#1a1a2e', alignItems: 'center', padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', marginTop: 20, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', backgroundColor: '#0f3460', color: '#fff', borderRadius: 12, padding: 14, fontSize: 15, minHeight: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#e94560', marginBottom: 16 },
  btn: { backgroundColor: '#e94560', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginBottom: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: { width: '100%', alignItems: 'center', marginTop: 10 },
  memeBox: { width: '100%', backgroundColor: '#0f3460', borderRadius: 12, padding: 20, borderWidth: 2, borderColor: '#e94560', marginBottom: 20 },
  caption: { color: '#FFD700', fontSize: 20, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  btnReset: { backgroundColor: '#6c757d', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
});

export default ContextReaderScreen;
