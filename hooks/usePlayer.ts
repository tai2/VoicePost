import { useRef, useState } from "react";
import { Audio } from "expo-av";
import { Config } from "@/constants/Config";

export const usePlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundPosition, setSoundPosition] = useState<number>(0);

  const load = async (uri: string) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      undefined,
      (status) => {
        if (!status.isLoaded) {
          return;
        }

        if (status.didJustFinish) {
          setIsPlaying(false);
          setSoundPosition(0);
          sound.setStatusAsync({
            positionMillis: 0,
          });
          return;
        }

        if (status.isPlaying) {
          setSoundPosition(status.positionMillis);
        }
      }
    );
    soundRef.current = sound;

    // Due to the bug in slider, setting the position to zero doesn't reset the position when the thumb is manually
    // moved by user. So, we need to set it to value other than zero.
    setSoundPosition(1);
  };

  const play = async () => {
    setIsPlaying(true);

    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    await sound.playAsync();
  };

  const pause = async () => {
    setIsPlaying(false);

    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    await sound.pauseAsync();
  };

  const forward = async () => {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    const positionMillis = status.positionMillis + Config.skipDuration;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.min(status.durationMillis, positionMillis));
  };

  const rewind = async () => {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    const positionMillis = status.positionMillis - Config.skipDuration;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.max(0, positionMillis));
  };

  const changePosition = async (position: number) => {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    sound.setStatusAsync({
      positionMillis: status.durationMillis * position,
    });
    if (!isPlaying) {
      setSoundPosition(status.durationMillis * position);
    }
  };

  return {
    isPlaying,
    soundPosition,
    load,
    play,
    pause,
    forward,
    rewind,
    changePosition,
  };
};
