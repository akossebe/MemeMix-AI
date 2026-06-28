import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import Share from 'react-native-share';

interface ContextResult {
  memeIdea: string;
  method1: {
    imageUrl: string;
    templateName: string;
  };
  method2: {
    imageUrl: string;
    prompt: string;
  };
}

export default function ContextReaderScreen() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContextResult | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un texte à analyser.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Remplacer localhost par l'IP de votre machine pour Android/iOS
      const response = await fetch('http://localhost:5000/api/context-reader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        Alert.alert('Erreur', data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (imageUrl: string, caption: string) => {
    try {
      await Share.open({
        url: imageUrl,
        message: caption,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Context Reader</Text>
      <Text style={styles.subtitle}>Entrez un texte et laissez l'IA créer le mème parfait !</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Quand je push en prod le vendredi soir..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={analyzeText} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Générer le Mème</Text>}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.ideaText}>💡 Idée : {result.memeIdea}</Text>
          
          <View style={styles.memeSection}>
            <Text style={styles.sectionTitle}>Option 1 : Template Classique</Text>
            <Image source={{ uri: result.method1.imageUrl }} style={styles.memeImage} />
            <Text style={styles.templateName}>{result.method1.templateName}</Text>
            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={() => handleShare(result.method1.imageUrl, result.memeIdea)}
            >
              <Text style={styles.shareButtonText}>📤 Partager ce mème</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.memeSection}>
            <Text style={styles.sectionTitle}>Option 2 : IA Générative</Text>
            <Image source={{ uri: result.method2.imageUrl }} style={styles.memeImage} />
            <Text style={styles.promptText}>{result.method2.prompt}</Text>
            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={() => handleShare(result.method2.imageUrl, result.memeIdea)}
            >
              <Text style={styles.shareButtonText}>📤 Partager ce mème</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 40, color: '#333' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, fontSize: 16, height: 100, textAlignVertical: 'top', marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#6200ee', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultContainer: { marginTop: 30, marginBottom: 50 },
  ideaText: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, color: '#444' },
  memeSection: { marginBottom: 30, alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  memeImage: { width: '100%', height: 300, borderRadius: 10, marginBottom: 10 },
  templateName: { fontSize: 14, color: '#888', textAlign: 'center' },
  promptText: { fontSize: 12, color: '#666', textAlign: 'center', fontStyle: 'italic' },
  shareButton: { marginTop: 15, backgroundColor: '#03dac6', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  shareButtonText: { color: '#fff', fontWeight: 'bold' },
});
