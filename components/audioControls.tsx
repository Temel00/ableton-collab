import React, { useState, useEffect } from 'react';
import { useAudioControls } from '../hooks/useAudioControls';
import styles from '../styles/Home.module.css';

function AudioControls() {
  const { togglePlayPause, playing, stop, volume, setVolume, duration, getPosition, seek } =
    useAudioControls();

  const [seekValue, setSeekValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const updatePosition = () => {
      const player = document.getElementById('audioBox') as HTMLDivElement;
      if (duration > 0) {
        console.log('Current height: ' + player.offsetHeight);
        player.style.transform = 'translate(0px, 0px)';
        player.style.opacity = '1';
        setCurrentTime(getPosition());
        setSeekValue(getPosition() / duration);
      } else {
        // player.style.opacity = '0.2';
        player.style.transform = 'translate(0px, ' + player.offsetHeight + 'px)';
        player.style.opacity = '.4';
        setSeekValue(0);
      }
    };

    const positionUpdateInterval = setInterval(updatePosition, 100);

    if (!playing) {
      clearInterval(positionUpdateInterval);
    }

    return () => clearInterval(positionUpdateInterval);
  }, [playing, duration, getPosition()]);

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
  };

  return (
    <div className={styles.audioControlsBox} id="audioBox">
      <div className={styles.audioControls}>
        <div className={styles.audioControlButtons}>
          <button className={styles.audioPlayPause} onClick={handlePlayPause}>
            {playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="currentColor"
              >
                <path d="M600-200q-33 0-56.5-23.5T520-280v-400q0-33 23.5-56.5T600-760h80q33 0 56.5 23.5T760-680v400q0 33-23.5 56.5T680-200h-80Zm-320 0q-33 0-56.5-23.5T200-280v-400q0-33 23.5-56.5T280-760h80q33 0 56.5 23.5T440-680v400q0 33-23.5 56.5T360-200h-80Zm320-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="currentColor"
              >
                <path d="M381-239q-20 13-40.5 1.5T320-273v-414q0-24 20.5-35.5T381-721l326 207q18 12 18 34t-18 34L381-239Zm19-241Zm0 134 210-134-210-134v268Z" />
              </svg>
            )}
          </button>
          <button className={styles.audioStop} onClick={handleStop}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path d="M320-640v320-320Zm0 400q-33 0-56.5-23.5T240-320v-320q0-33 23.5-56.5T320-720h320q33 0 56.5 23.5T720-640v320q0 33-23.5 56.5T640-240H320Zm0-80h320v-320H320v320Z" />
            </svg>
          </button>
        </div>
        <div className={styles.audioVolume}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="currentColor"
          >
            <path d="M760-481q0-83-44-151.5T598-735q-15-7-22-21.5t-2-29.5q6-16 21.5-23t31.5 0q97 43 155 131.5T840-481q0 108-58 196.5T627-153q-16 7-31.5 0T574-176q-5-15 2-29.5t22-21.5q74-34 118-102.5T760-481ZM280-360H160q-17 0-28.5-11.5T120-400v-160q0-17 11.5-28.5T160-600h120l132-132q19-19 43.5-8.5T480-703v446q0 27-24.5 37.5T412-228L280-360Zm380-120q0 42-19 79.5T591-339q-10 6-20.5.5T560-356v-250q0-12 10.5-17.5t20.5.5q31 25 50 63t19 80ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <div className={styles.audioSeek}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={seekValue}
          onChange={handleSeekChange}
        />
        <div className={styles.audioSeekTime}>
          <div>{Math.floor(getPosition() * 100) / 100}</div>
          <div>{Math.floor(duration)}</div>
        </div>
      </div>
    </div>
  );
}

export default AudioControls;
