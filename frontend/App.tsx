import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import ContextReaderScreen from './src/screens/ContextReaderScreen';
import VoiceToMemeScreen from './src/screens/VoiceToMemeScreen';
import StatusRemixerScreen from './src/screens/StatusRemixerScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#e94560',
            borderTopWidth: 2,
            height: 65,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
            borderBottomColor: '#e94560',
            borderBottomWidth: 2,
          },
          headerTintColor: '#FFD700',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Tab.Screen
          name="ContextReader"
          component={ContextReaderScreen}
          options={{
            title: 'Context Reader',
            tabBarLabel: 'Texte',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>💬</Text>
            ),
          }}
        />
        <Tab.Screen
          name="VoiceToMeme"
          component={VoiceToMemeScreen}
          options={{
            title: 'Voice to Meme',
            tabBarLabel: 'Vocal',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🎙️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="StatusRemixer"
          component={StatusRemixerScreen}
          options={{
            title: 'Status Remixer',
            tabBarLabel: 'Image',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🖼️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
