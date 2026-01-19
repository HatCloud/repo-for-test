import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// Sound objects cache
let workSound: Audio.Sound | null = null;
let restSound: Audio.Sound | null = null;
let completeSound: Audio.Sound | null = null;
let countdownSound: Audio.Sound | null = null;

// Initialize audio mode for background playback
export const initAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.warn('Failed to set audio mode:', error);
  }
};

// Preload sounds for better performance
export const preloadSounds = async () => {
  try {
    // Using online sound effects (royalty-free)
    const { sound: work } = await Audio.Sound.createAsync(
      { uri: 'https://cdn.freesound.org/previews/536/536420_4921277-lq.mp3' }, // Whistle sound
      { shouldPlay: false }
    );
    workSound = work;

    const { sound: rest } = await Audio.Sound.createAsync(
      { uri: 'https://cdn.freesound.org/previews/411/411642_5121236-lq.mp3' }, // Gentle chime
      { shouldPlay: false }
    );
    restSound = rest;

    const { sound: complete } = await Audio.Sound.createAsync(
      { uri: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3' }, // Success fanfare
      { shouldPlay: false }
    );
    completeSound = complete;

    const { sound: countdown } = await Audio.Sound.createAsync(
      { uri: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3' }, // Beep
      { shouldPlay: false }
    );
    countdownSound = countdown;
  } catch (error) {
    console.warn('Failed to preload sounds:', error);
  }
};

// Unload sounds to free memory
export const unloadSounds = async () => {
  try {
    if (workSound) await workSound.unloadAsync();
    if (restSound) await restSound.unloadAsync();
    if (completeSound) await completeSound.unloadAsync();
    if (countdownSound) await countdownSound.unloadAsync();
  } catch (error) {
    console.warn('Failed to unload sounds:', error);
  }
};

// Play sound with haptic feedback
export const playFeedback = async (type: 'work' | 'rest' | 'complete' | 'countdown') => {
  try {
    // Play haptic feedback
    switch (type) {
      case 'complete':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'work':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'rest':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'countdown':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }

    // Play sound
    let sound: Audio.Sound | null = null;
    switch (type) {
      case 'work':
        sound = workSound;
        break;
      case 'rest':
        sound = restSound;
        break;
      case 'complete':
        sound = completeSound;
        break;
      case 'countdown':
        sound = countdownSound;
        break;
    }

    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch (error) {
    // Sound playback failed, haptics already played
    console.warn('Sound playback failed:', error);
  }
};
