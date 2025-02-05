import { useRef, useState } from "react";
import { Audio } from "expo-av";
import { Config } from "@/constants/Config";

export const usePlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundPosition, setSoundPosition] = useState<number>(0);
  const [soundDuration, setSoundDuration] = useState<number>(0);
  const soundPositionRef = useRef<number>(0);
  soundPositionRef.current = soundPosition;

  // According to the doc of Slider, it shouldn't trigger any event by programmatically changing the value. However,
  // it triggers onValueChange on Android probably due to a bug. So, we need to keep track of whether the user is
  // sliding.
  const [isSliding, setIsSliding] = useState(false);

  const load = async (uri: string, initialDuration: number) => {
    setSoundDuration(initialDuration);
    setIsPlaying(false);

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
          sound.stopAsync();
          return;
        }

        if (
          status.isPlaying &&
          !isSliding &&
          // Slider sometimes delays on calling onValueChange with a stale value and brings a big jump. To prevent it,
          // we update the position only when the difference is reasonable.
          Math.abs(status.positionMillis - soundPositionRef.current) <
            status.progressUpdateIntervalMillis * 1.2
        ) {
          setSoundPosition(status.positionMillis);
        }
      }
    );

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }
    setSoundDuration(status.durationMillis);
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

  const onSlidingStart = () => {
    setIsSliding(true);
  };

  const onSliding = (position: number) => {
    if (!isSliding) {
      return;
    }
    setSoundPosition(soundDuration * position);
  };

  const onSlidingStop = async (position: number) => {
    setIsSliding(false);

    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      console.error("Sound is not loaded");
      return;
    }

    setSoundPosition(soundDuration * position);
    sound.setStatusAsync({
      positionMillis: soundDuration * position,
    });
  };

  return {
    isPlaying,
    soundPosition,
    soundDuration,
    load,
    play,
    pause,
    forward,
    rewind,
    isSliding,
    onSlidingStart,
    onSlidingStop,
    onSliding,
  };
};
