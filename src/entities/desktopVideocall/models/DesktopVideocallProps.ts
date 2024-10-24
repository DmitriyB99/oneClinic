import type { Dispatch, SetStateAction } from "react";

interface Device {
  label: string;
  value: string;
}

export interface DesktopSettingsProps {
  devices: { audioInput: Device[]; audioOutput: Device[]; cameras: Device[] };
  setCheckAudio: Dispatch<SetStateAction<boolean>>;
  setSettings: (state: boolean) => void;
  setSpeaker: (value: {
    camera: Device | null;
    mic: Device | null;
    speaker: Device | null;
  }) => void;
  setValue: (value: {
    camera: Device | null;
    mic: Device | null;
    speaker: Device | null;
  }) => void;
  value: { camera: Device | null; mic: Device | null; speaker: Device | null };
}
