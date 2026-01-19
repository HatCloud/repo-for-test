import axios from 'axios';
import * as Device from 'expo-device';
import { API_BASE_URL } from '../config';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@device_id';

let deviceId: string | null = null;

const getDeviceId = async (): Promise<string> => {
  if (deviceId) return deviceId;

  const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    deviceId = stored;
    return stored;
  }

  const newId = Device.modelName ? `${Device.modelName}-${uuidv4()}` : uuidv4();
  await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
  deviceId = newId;
  return newId;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const id = await getDeviceId();
  config.headers['X-Device-Id'] = id;
  return config;
});

export interface Template {
  id: string;
  device_id: string;
  name: string;
  work_duration: number;
  rest_duration: number;
  rounds: number;
  sets: number;
  set_rest_duration: number;
  created_at: string;
}

export interface WorkoutRecord {
  id: string;
  device_id: string;
  template_id: string | null;
  template_name: string;
  work_duration: number;
  rest_duration: number;
  rounds: number;
  sets: number;
  completed_rounds: number;
  completed_sets: number;
  total_time: number;
  completed_at: string;
}

export interface Stats {
  total_workouts: number;
  total_time: number;
  total_rounds: number;
  avg_workout_time: number;
}

// Templates API
export const getTemplates = async (): Promise<Template[]> => {
  const response = await api.get('/api/templates');
  return response.data;
};

export const createTemplate = async (template: Omit<Template, 'id' | 'device_id' | 'created_at'>): Promise<Template> => {
  const response = await api.post('/api/templates', template);
  return response.data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await api.delete(`/api/templates/${id}`);
};

// Records API
export const getRecords = async (limit = 50, offset = 0): Promise<{ records: WorkoutRecord[]; total: number }> => {
  const response = await api.get('/api/records', { params: { limit, offset } });
  return response.data;
};

export const saveRecord = async (record: Omit<WorkoutRecord, 'id' | 'device_id' | 'completed_at'>): Promise<WorkoutRecord> => {
  const response = await api.post('/api/records', record);
  return response.data;
};

export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/api/records/stats');
  return response.data;
};

export default api;
