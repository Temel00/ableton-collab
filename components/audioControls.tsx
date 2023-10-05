// components/AudioPlayerControls.tsx

import React, { useState, useEffect } from 'react';
import { useAudioControls } from '../hooks/useAudioControls';

function AudioControls() {
  const { togglePlayPause, playing, stop, volume, setVolume, duration, getPosition, seek } =
    useAudioControls();

  const [seekValue, setSeekValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    // Update the seek bar value based on the current time and duration
    const updatePosition = () => {
      if (duration > 0) {
        setCurrentTime(getPosition());
        setSeekValue(currentTime / duration);
      } else {
        setSeekValue(0);
      }
    };

    const positionUpdateInterval = setInterval(updatePosition, 1000);

    return () => clearInterval(positionUpdateInterval);
  }, [getPosition()]);

  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleStop = () => {
    stop();
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSeekValue = parseFloat(event.target.value);
    setSeekValue(newSeekValue);
    const newCurrentTime = newSeekValue * duration;
    seek(newCurrentTime);
    // Seek to the new position
    // You might want to add logic to seek to the new time in your audio player library.
  };

  return (
    <div>
      <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={handleStop}>Stop</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={seekValue}
          onChange={handleSeekChange}
        />
        <div>{`${Math.floor(currentTime)} / ${Math.floor(duration)}`}</div>
      </div>
    </div>
  );
}

export default AudioControls;
