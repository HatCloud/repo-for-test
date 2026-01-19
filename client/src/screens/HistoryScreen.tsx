import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../config';
import { Ionicons } from '@expo/vector-icons';

interface HistoryScreenProps {
  navigation: any;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 模拟数据
const mockRecords = [
  {
    id: '1',
    template_name: '经典 HIIT',
    work_duration: 20,
    rest_duration: 10,
    rounds: 8,
    completed_rounds: 8,
    total_time: 240,
    completed_at: '2024-01-19T10:30:00Z',
  },
  {
    id: '2',
    template_name: 'Tabata',
    work_duration: 20,
    rest_duration: 10,
    rounds: 8,
    completed_rounds: 6,
    total_time: 180,
    completed_at: '2024-01-18T09:15:00Z',
  },
];

const mockStats = {
  total_workouts: 15,
  total_time: 3600,
  total_rounds: 120,
  avg_workout_time: 240,
};

export const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>训练记录</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{mockStats.total_workouts}</Text>
          <Text style={styles.statsLabel}>总训练次数</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{Math.floor(mockStats.total_time / 60)}</Text>
          <Text style={styles.statsLabel}>总时长(分钟)</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{mockStats.total_rounds}</Text>
          <Text style={styles.statsLabel}>总轮数</Text>
        </View>
      </View>

      {/* History List */}
      <Text style={styles.sectionTitle}>最近记录</Text>
      <ScrollView style={styles.list}>
        {mockRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>完成一次训练后会显示在这里</Text>
          </View>
        ) : (
          mockRecords.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordName}>{record.template_name}</Text>
                <Text style={styles.recordDate}>{formatDate(record.completed_at)}</Text>
              </View>
              <View style={styles.recordStats}>
                <View style={styles.recordStat}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.recordStatText}>{formatTime(record.total_time)}</Text>
                </View>
                <View style={styles.recordStat}>
                  <Ionicons name="repeat-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.recordStatText}>
                    {record.completed_rounds}/{record.rounds} 轮
                  </Text>
                </View>
                {record.completed_rounds === record.rounds ? (
                  <View style={[styles.badge, styles.completeBadge]}>
                    <Text style={styles.badgeText}>完成</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, styles.incompleteBadge]}>
                    <Text style={styles.badgeText}>未完成</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  recordDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  recordStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recordStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordStatText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completeBadge: {
    backgroundColor: COLORS.success + '30',
  },
  incompleteBadge: {
    backgroundColor: COLORS.warning + '30',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
});
