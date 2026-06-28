import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContextReaderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💬 Context Reader — À venir</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' },
  text: { color: '#FFD700', fontSize: 18 },
});

export default ContextReaderScreen;
