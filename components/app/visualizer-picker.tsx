'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/shadcn/utils';

export const AUDIO_VISUALIZER_OPTIONS = [
  { value: 'bar', label: 'Bars' },
  { value: 'wave', label: 'Wave' },
  { value: 'grid', label: 'Grid' },
  { value: 'radial', label: 'Radial' },
  { value: 'aura', label: 'Aura' },
] as const;

export type AudioVisualizerType = (typeof AUDIO_VISUALIZER_OPTIONS)[number]['value'];

export const AUDIO_VISUALIZER_STORAGE_KEY = 'jarvis.audio-visualizer-type';

interface VisualizerPickerProps {
  value: AudioVisualizerType;
  onValueChange: (value: AudioVisualizerType) => void;
  className?: string;
}

export function VisualizerPicker({ value, onValueChange, className }: VisualizerPickerProps) {
  return (
    <div
      className={cn(
        'border-border bg-background/90 flex items-center gap-2 rounded-full border py-1 pr-1 pl-3 shadow-sm backdrop-blur',
        className
      )}
    >
      <label
        htmlFor="audio-visualizer-select"
        className="text-muted-foreground font-mono text-[10px] font-bold tracking-wider uppercase select-none"
      >
        Visualizer
      </label>
      <Select value={value} onValueChange={(next) => onValueChange(next as AudioVisualizerType)}>
        <SelectTrigger
          id="audio-visualizer-select"
          size="sm"
          aria-label="Select audio visualizer"
          className="h-7 rounded-full border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" position="popper">
          {AUDIO_VISUALIZER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
