import { Platform } from 'react-native';

// API 基础配置
// Android 模拟器: 10.0.2.2
// iOS 模拟器: localhost
// 真机调试: 使用电脑局域网 IP
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
  }
  // 生产环境 URL
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBaseUrl();

// 默认训练模板
export const DEFAULT_TEMPLATES = [
  {
    name: '经典 HIIT',
    work_duration: 20,
    rest_duration: 10,
    rounds: 8,
    sets: 1,
    set_rest_duration: 60,
  },
  {
    name: 'Tabata',
    work_duration: 20,
    rest_duration: 10,
    rounds: 8,
    sets: 4,
    set_rest_duration: 60,
  },
  {
    name: '新手入门',
    work_duration: 30,
    rest_duration: 30,
    rounds: 6,
    sets: 1,
    set_rest_duration: 60,
  },
];

// 颜色主题
export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#1A1A2E',
  surface: '#16213E',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  work: '#FF6B6B',
  rest: '#4ECDC4',
  success: '#10B981',
  warning: '#F59E0B',
};
