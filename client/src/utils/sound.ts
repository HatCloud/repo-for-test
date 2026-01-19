import * as Haptics from 'expo-haptics';

export const playFeedback = async (type: 'work' | 'rest' | 'complete' | 'countdown') => {
  try {
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
  } catch (error) {
    // Haptics not available on all devices
  }
};
