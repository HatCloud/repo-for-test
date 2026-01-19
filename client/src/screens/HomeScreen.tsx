import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { useTimer, TimerPhase } from '../hooks/useTimer';
import { COLORS } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { useTimerContext } from '../context/TimerContext';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.75;

const getPhaseText = (phase: TimerPhase): string => {
  switch (phase) {
    case 'idle':
      return '准备开始';
    case 'work':
      return '运动';
    case 'rest':
      return '休息';
    case 'set_rest':
      return '组间休息';
    case 'complete':
      return '完成!';
    default:
      return '';
  }
};

const getPhaseColor = (phase: TimerPhase): string => {
  switch (phase) {
    case 'work':
      return COLORS.work;
    case 'rest':
    case 'set_rest':
      return COLORS.rest;
    case 'complete':
      return COLORS.success;
    default:
      return COLORS.primary;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { config: contextConfig, setConfig: setContextConfig, selectedTemplateName } = useTimerContext();
  const { config, state, start, pause, resume, reset, updateConfig } = useTimer(contextConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  useEffect(() => {
    updateConfig(contextConfig);
  }, [contextConfig]);

  const getProgress = (): number => {
    if (state.phase === 'idle') return 1;
    if (state.phase === 'complete') return 1;

    let totalDuration = config.workDuration;
    if (state.phase === 'rest') totalDuration = config.restDuration;
    if (state.phase === 'set_rest') totalDuration = config.setRestDuration;

    return state.timeRemaining / totalDuration;
  };

  const handleMainButton = () => {
    if (state.phase === 'idle' || state.phase === 'complete') {
      start();
    } else if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const getMainButtonIcon = (): string => {
    if (state.phase === 'idle' || state.phase === 'complete') {
      return 'play';
    }
    return state.isPaused ? 'play' : 'pause';
  };

  const adjustValue = (key: keyof typeof tempConfig, delta: number, min: number, max: number) => {
    setTempConfig((prev) => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, prev[key] + delta)),
    }));
  };

  const applySettings = () => {
    setContextConfig(tempConfig);
    updateConfig(tempConfig);
    reset();
    setShowSettings(false);
  };

  const phaseColor = getPhaseColor(state.phase);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>健身计时器</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            setTempConfig(config);
            setShowSettings(true);
          }}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Template Name */}
      <TouchableOpacity
        style={styles.templateSelector}
        onPress={() => navigation.navigate('Templates')}
      >
        <Ionicons name="fitness" size={18} color={COLORS.primary} />
        <Text style={styles.templateName}>{selectedTemplateName}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <ProgressRing
          progress={getProgress()}
          size={RING_SIZE}
          strokeWidth={12}
          color={phaseColor}
        >
          <View style={styles.timerContent}>
            <Text style={[styles.phaseText, { color: phaseColor }]}>
              {getPhaseText(state.phase)}
            </Text>
            <Text style={styles.timeText}>{formatTime(state.timeRemaining)}</Text>
            <Text style={styles.roundText}>
              {config.sets > 1 && `组 ${state.currentSet}/${config.sets} · `}
              轮 {state.currentRound}/{config.rounds}
            </Text>
          </View>
        </ProgressRing>
      </View>

      {/* Config Display */}
      <View style={styles.configContainer}>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>运动</Text>
          <Text style={styles.configValue}>{config.workDuration}s</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>休息</Text>
          <Text style={styles.configValue}>{config.restDuration}s</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>轮数</Text>
          <Text style={styles.configValue}>{config.rounds}</Text>
        </View>
        {config.sets > 1 && (
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>组数</Text>
            <Text style={styles.configValue}>{config.sets}</Text>
          </View>
        )}
      </View>

      {/* Total Time */}
      {state.totalTime > 0 && (
        <Text style={styles.totalTime}>
          总用时: {formatTime(state.totalTime)}
        </Text>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={reset}
        >
          <Ionicons name="refresh" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: phaseColor }]}
          onPress={handleMainButton}
        >
          <Ionicons name={getMainButtonIcon() as any} size={40} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="stats-chart" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>训练设置</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Work Duration */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>运动时长</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('workDuration', -5, 5, 120)}
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.settingValue}>{tempConfig.workDuration}s</Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('workDuration', 5, 5, 120)}
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rest Duration */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>休息时长</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('restDuration', -5, 5, 60)}
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.settingValue}>{tempConfig.restDuration}s</Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('restDuration', 5, 5, 60)}
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rounds */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>轮数</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('rounds', -1, 1, 20)}
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.settingValue}>{tempConfig.rounds}</Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('rounds', 1, 1, 20)}
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sets */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>组数</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('sets', -1, 1, 10)}
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.settingValue}>{tempConfig.sets}</Text>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustValue('sets', 1, 1, 10)}
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={applySettings}>
              <Text style={styles.applyButtonText}>应用设置</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingsButton: {
    padding: 8,
  },
  templateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerContent: {
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  roundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  configContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 20,
  },
  configItem: {
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  configValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalTime: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: 'auto',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    width: 60,
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
