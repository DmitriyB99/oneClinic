import type { FC } from "react";

import { Divider } from "antd";
import { useTranslations } from "next-intl";

import {
  Button,
  CloseIcon,
  DesktopSelect,
  SpeakerIcon,
} from "@/shared/components";
import type { DesktopSelectOptionProps } from "@/shared/components";

import type { DesktopSettingsProps } from "../models/DesktopVideocallProps";

export const DesktopSettings: FC<DesktopSettingsProps> = ({
  setSettings,
  devices,
  value,
  setValue,
  setCheckAudio,
  setSpeaker,
}) => {
  const tDesktop = useTranslations("Desktop.ConfigCall");

  return (
    <div
      className="absolute z-50 mt-20 flex !h-[656px] w-[502px] flex-col items-center
    rounded-2xl border border-solid border-borderDefault bg-darkVideo p-7"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <p className="m-0 p-0 text-Semibold20 text-highEmphasis">
          {tDesktop("AudioAndVideo")}
        </p>
        <Button variant="tertiary" onClick={() => setSettings(false)}>
          <CloseIcon color="white" />
        </Button>
      </div>
      <Divider className="bg-borderDefault" />
      <div className="w-full">
        <p className="m-0 mb-3 p-0 text-Regular14 text-highEmphasis">
          {tDesktop("Video")}
        </p>
        <DesktopSelect
          className="w-full !bg-surfaceLight"
          options={devices.cameras}
          value={value.camera}
          onChange={(valStr, valObj) =>
            setValue({
              ...value,
              camera: valObj as DesktopSelectOptionProps,
            })
          }
        />
        <p className="m-0 mb-3 mt-5 p-0 text-Regular14 text-highEmphasis">
          {tDesktop("Microphone")}
        </p>
        <DesktopSelect
          className="w-full !bg-surfaceLight"
          value={value.mic}
          options={devices.audioInput}
          onChange={(valStr, valObj) =>
            setValue({
              ...value,
              mic: valObj as DesktopSelectOptionProps,
            })
          }
        />
        <p className="m-0 mb-3 mt-5 p-0 text-Regular14 text-highEmphasis">
          {tDesktop("Sound")}
        </p>
        <div className="m-0 flex w-full flex-row items-center justify-between p-0">
          <div className="w-[314px]">
            <DesktopSelect
              className="m-0 w-full !bg-surfaceLight p-0"
              options={devices.audioOutput}
              value={value.speaker}
              onChange={(valStr, valObj) =>
                setSpeaker({
                  ...value,
                  speaker: valObj as DesktopSelectOptionProps,
                })
              }
            />
          </div>
          <Button
            variant="tertiary"
            className="m-0 p-0 text-highEmphasis"
            onClick={() => setCheckAudio((prev) => !prev)}
          >
            <div className="flex h-12 w-[108px] items-center justify-center rounded-xl bg-secondaryDefault text-highEmphasis">
              <div className="mr-1 flex items-center justify-center">
                <SpeakerIcon size="sm" />
              </div>
              {tDesktop("Test")}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
