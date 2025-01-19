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

        if (status.durationMillis) {
          if (status.isPlaying) {
            setSoundPosition(status.positionMillis);
          }
        }
      }
    );
    soundRef.current = sound;

    setSoundPosition(0);
  };

  const play = async () => {
    setIsPlaying(true);

    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    console.log("Playing Sound");
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
