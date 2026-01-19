import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { TimerConfig } from '../hooks/useTimer';
import { DEFAULT_TEMPLATES } from '../config';

interface TimerContextType {
  config: TimerConfig;
  setConfig: (config: TimerConfig) => void;
  selectedTemplateName: string;
  setSelectedTemplateName: (name: string) => void;
}

const defaultConfig: TimerConfig = {
  workDuration: DEFAULT_TEMPLATES[0].work_duration,
  restDuration: DEFAULT_TEMPLATES[0].rest_duration,
  rounds: DEFAULT_TEMPLATES[0].rounds,
  sets: DEFAULT_TEMPLATES[0].sets,
  setRestDuration: DEFAULT_TEMPLATES[0].set_rest_duration,
};

const TimerContext = createContext<TimerContextType>({
  config: defaultConfig,
  setConfig: () => {},
  selectedTemplateName: DEFAULT_TEMPLATES[0].name,
  setSelectedTemplateName: () => {},
});

export function TimerProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<TimerConfig>(defaultConfig);
  const [selectedTemplateName, setSelectedTemplateName] = useState(DEFAULT_TEMPLATES[0].name);

  return (
    <TimerContext.Provider
      value={{
        config,
        setConfig,
        selectedTemplateName,
        setSelectedTemplateName,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerContext = () => useContext(TimerContext);
