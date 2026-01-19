import { useState, useRef, useCallback, useEffect } from 'react';
import { playFeedback } from '../utils/sound';

export type TimerPhase = 'idle' | 'work' | 'rest' | 'set_rest' | 'complete';

export interface TimerConfig {
  workDuration: number;
  restDuration: number;
  rounds: number;
  sets: number;
  setRestDuration: number;
}

export interface TimerState {
  phase: TimerPhase;
  timeRemaining: number;
  currentRound: number;
  currentSet: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 20,
  restDuration: 10,
  rounds: 8,
  sets: 1,
  setRestDuration: 60,
};

export const useTimer = (initialConfig: TimerConfig = DEFAULT_CONFIG) => {
  const [config, setConfig] = useState<TimerConfig>(initialConfig);
  const [state, setState] = useState<TimerState>({
    phase: 'idle',
    timeRemaining: initialConfig.workDuration,
    currentRound: 1,
    currentSet: 1,
    totalTime: 0,
    isRunning: false,
    isPaused: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState({
      phase: 'idle',
      timeRemaining: config.workDuration,
      currentRound: 1,
      currentSet: 1,
      totalTime: 0,
      isRunning: false,
      isPaused: false,
    });
  }, [config.workDuration, clearTimer]);

  const tick = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning || prev.isPaused) return prev;

      const newTimeRemaining = prev.timeRemaining - 1;
      const newTotalTime = prev.totalTime + 1;

      // 倒计时最后3秒提示
      if (newTimeRemaining <= 3 && newTimeRemaining > 0) {
        playFeedback('countdown');
      }

      // 当前阶段结束
      if (newTimeRemaining <= 0) {
        const { currentRound, currentSet, phase } = prev;

        if (phase === 'work') {
          // 运动结束,进入休息
          if (currentRound < config.rounds) {
            playFeedback('rest');
            return {
              ...prev,
              phase: 'rest',
              timeRemaining: config.restDuration,
              totalTime: newTotalTime,
            };
          } else if (currentSet < config.sets) {
            // 当前组结束,进入组间休息
            playFeedback('rest');
            return {
              ...prev,
              phase: 'set_rest',
              timeRemaining: config.setRestDuration,
              currentRound: config.rounds,
              totalTime: newTotalTime,
            };
          } else {
            // 全部结束
            playFeedback('complete');
            return {
              ...prev,
              phase: 'complete',
              timeRemaining: 0,
              totalTime: newTotalTime,
              isRunning: false,
            };
          }
        } else if (phase === 'rest') {
          // 休息结束,进入下一轮运动
          playFeedback('work');
          return {
            ...prev,
            phase: 'work',
            timeRemaining: config.workDuration,
            currentRound: currentRound + 1,
            totalTime: newTotalTime,
          };
        } else if (phase === 'set_rest') {
          // 组间休息结束,进入下一组
          playFeedback('work');
          return {
            ...prev,
            phase: 'work',
            timeRemaining: config.workDuration,
            currentRound: 1,
            currentSet: currentSet + 1,
            totalTime: newTotalTime,
          };
        }
      }

      return {
        ...prev,
        timeRemaining: newTimeRemaining,
        totalTime: newTotalTime,
      };
    });
  }, [config]);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.phase === 'idle' || prev.phase === 'complete') {
        playFeedback('work');
        return {
          ...prev,
          phase: 'work',
          timeRemaining: config.workDuration,
          currentRound: 1,
          currentSet: 1,
          totalTime: 0,
          isRunning: true,
          isPaused: false,
        };
      }
      return {
        ...prev,
        isRunning: true,
        isPaused: false,
      };
    });

    startTimeRef.current = Date.now();
    clearTimer();
    intervalRef.current = setInterval(tick, 1000);
  }, [config.workDuration, clearTimer, tick]);

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Update timeRemaining when config changes (only in idle state)
  useEffect(() => {
    if (state.phase === 'idle') {
      setState((prev) => ({
        ...prev,
        timeRemaining: config.workDuration,
      }));
    }
  }, [config.workDuration, state.phase]);

  return {
    config,
    state,
    start,
    pause,
    resume,
    reset,
    updateConfig,
  };
};
