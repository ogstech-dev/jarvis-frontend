'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { useAgent, useSessionContext } from '@livekit/components-react';
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01';
import {
  AUDIO_VISUALIZER_OPTIONS,
  AUDIO_VISUALIZER_STORAGE_KEY,
  type AudioVisualizerType,
  VisualizerPicker,
} from '@/components/app/visualizer-picker';
import { WelcomeView } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(AgentSessionView_01);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.5,
    ease: 'linear',
  },
};

interface ViewControllerProps {
  isVideoInputSupported: boolean;
}

export function ViewController({ isVideoInputSupported }: ViewControllerProps) {
  const { isConnected, start } = useSessionContext();
  const agent = useAgent();
  const { resolvedTheme } = useTheme();
  const [audioVisualizerType, setAudioVisualizerType] = useState<AudioVisualizerType>('bar');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUDIO_VISUALIZER_STORAGE_KEY);
      if (stored && AUDIO_VISUALIZER_OPTIONS.some((option) => option.value === stored)) {
        setAudioVisualizerType(stored as AudioVisualizerType);
      }
    } catch {
      // localStorage can be unavailable (e.g. privacy mode); fall back to the default.
    }
  }, []);

  const handleAudioVisualizerChange = (value: AudioVisualizerType) => {
    setAudioVisualizerType(value);
    try {
      window.localStorage.setItem(AUDIO_VISUALIZER_STORAGE_KEY, value);
    } catch {
      // Persisting the preference is best-effort.
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 md:top-20 md:right-6">
        <VisualizerPicker value={audioVisualizerType} onValueChange={handleAudioVisualizerChange} />
      </div>
      <AnimatePresence mode="wait">
        {/* Welcome view */}
        {!isConnected && (
          <MotionWelcomeView
            key="welcome"
            {...VIEW_MOTION_PROPS}
            startButtonText="Start call"
            onStartCall={start}
          />
        )}
        {/* Session view */}
        {isConnected && (
          <MotionSessionView
            key="session-view"
            {...VIEW_MOTION_PROPS}
            preConnectMessage={
              agent.isConnected ? 'Agent is listening, ask it a question' : 'Waiting for agent'
            }
            supportsChatInput={true}
            supportsVideoInput={isVideoInputSupported}
            supportsScreenShare={isVideoInputSupported}
            isPreConnectBufferEnabled={true}
            themeMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
            audioVisualizerType={audioVisualizerType}
            className="fixed inset-0"
          />
        )}
      </AnimatePresence>
    </>
  );
}
