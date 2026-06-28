import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import ContextReaderScreen from './src/screens/ContextReaderScreen';
import VoiceToMemeScreen from './src/screens/VoiceToMemeScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  if (currentScreen === 'context') {
    return <ContextReaderScreen onBack={() => setCurrentScreen('home')} />;
  }
  if (currentScreen === 'voice') {
    return <VoiceToMemeScreen onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MemeMixAI 🚀</Text>
        <Text style={styles.subtitle}>Créez des mèmes hilarants grâce à l'IA</Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#6200ee' }]} 
          onPress={() => setCurrentScreen('context')}
        >
          <Text style={styles.buttonText}>✍️ Analyse de Texte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#03dac6' }]} 
          onPress={() => setCurrentScreen('voice')}
        >
          <Text style={styles.buttonText}>🎙️ Enregistrement Vocal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' },
  button: { width: '100%', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
