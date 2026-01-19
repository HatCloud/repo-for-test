import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { getRecords, getStats, WorkoutRecord, Stats } from '../services/api';

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

export const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_workouts: 0,
    total_time: 0,
    total_rounds: 0,
    avg_workout_time: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [recordsData, statsData] = await Promise.all([
        getRecords(),
        getStats(),
      ]);
      setRecords(recordsData.records);
      setStats(statsData);
    } catch (error) {
      console.log('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

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
          <Text style={styles.statsValue}>{stats.total_workouts}</Text>
          <Text style={styles.statsLabel}>总训练次数</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{Math.floor(stats.total_time / 60)}</Text>
          <Text style={styles.statsLabel}>总时长(分钟)</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{stats.total_rounds}</Text>
          <Text style={styles.statsLabel}>总轮数</Text>
        </View>
      </View>

      {/* History List */}
      <Text style={styles.sectionTitle}>最近记录</Text>
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>暂无训练记录</Text>
            <Text style={styles.emptySubtext}>完成一次训练后会显示在这里</Text>
          </View>
        ) : (
          records.map((record) => (
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
