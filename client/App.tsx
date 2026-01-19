import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { TemplatesScreen } from './src/screens/TemplatesScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { COLORS } from './src/config';
import { TimerProvider } from './src/context/TimerContext';
import { initAudio, preloadSounds, unloadSounds } from './src/utils/sound';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize audio for background playback
    initAudio();
    preloadSounds();

    return () => {
      unloadSounds();
    };
  }, []);

  return (
    <TimerProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Templates"
              component={TemplatesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
