// hooks/useAudioControls.ts

import { useGlobalAudioPlayer } from 'react-use-audio-player';

export function useAudioControls() {
  const { togglePlayPause, playing, stop, volume, setVolume, duration, getPosition, seek } =
    useGlobalAudioPlayer();

  return {
    togglePlayPause,
    playing,
    stop,
    volume,
    setVolume,
    duration,
    getPosition,
    seek,
  };
}
