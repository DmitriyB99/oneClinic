import type { FC } from "react";
import { useState, useCallback, useRef, useEffect, useContext } from "react";
import { useQuery } from "react-query";

import { useTranslations } from "next-intl";

import { DesktopSettings } from "@/entities/desktopVideocall";
import { chatApi } from "@/shared/api/chat";
import {
  Button,
  GearIcon,
  MicIcon,
  VideoCameraIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";

interface Device {
  label: string;
  value: string;
}

interface DevicesValue {
  camera: Device | null;
  mic: Device | null;
  speaker: Device | null;
}

export const DesktopVideoCallConfigComponent: FC<{
  callId: string;
  isOffer: boolean;
}> = ({ callId, isOffer }) => {
  const [settings, setSettings] = useState<boolean>(false);
  const [generatedStream, setGeneratedStream] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [checkAudio, setCheckAudio] = useState(false);
  const [audioOutput, setAudioOutput] = useState<
    { label: string; value: string }[]
  >([]);
  const [audioInput, setAudioInput] = useState<Device[]>([]);
  const [cameras, setCameras] = useState<Device[]>([]);
  const [devicesValue, setDevicesValue] = useState<DevicesValue>({
    speaker: null,
    camera: null,
    mic: null,
  });
  const tDesktop = useTranslations("Desktop.ConfigCall");
  const t = useTranslations("Common");
  const videoElement = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream>();

  const { initCall, acceptCall } = useContext(CallContext);

  const { data: chatRoomName } = useQuery(
    ["getChatInfoForCallConfig", callId],
    () => chatApi.getChatInfo(callId).then((re) => re.data.name),
    { enabled: !!callId }
  );

  const startCall = useCallback(() => {
    stream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    if (!isOffer) {
      acceptCall(callId);
    } else {
      initCall(callId);
    }
  }, [acceptCall, callId, initCall, isOffer]);

  const gotStream = useCallback((_stream: MediaStream) => {
    stream.current = _stream;
    if (videoElement.current) videoElement.current.srcObject = _stream;
    return navigator.mediaDevices.enumerateDevices();
  }, []);

  const gotDevices = useCallback((deviceInfos: MediaDeviceInfo[]) => {
    const _speakers: Device[] = [];
    const _cameras: Device[] = [];
    const _mics: Device[] = [];
    deviceInfos.forEach((device) => {
      if (device.kind === "audioinput") {
        const value = {
          label: device.label || `microphone ${_mics.length + 1}`,
          value: device.deviceId,
        };
        if (_mics.length === 0) {
          setDevicesValue((prev) => ({ ...prev, mic: value }));
        }
        _mics.push(value);
      } else if (device.kind === "audiooutput") {
        const value = {
          label: device.label || `speaker ${_speakers.length + 1}`,
          value: device.deviceId,
        };
        if (_speakers.length === 0) {
          setDevicesValue((prev) => ({ ...prev, speaker: value }));
        }
        _speakers.push(value);
      } else if (device.kind === "videoinput") {
        const value = {
          label: device.label || `camera ${_cameras.length + 1}`,
          value: device.deviceId,
        };
        if (_cameras.length === 0) {
          setDevicesValue((prev) => ({ ...prev, camera: value }));
        }
        _cameras.push(value);
      }
    });
    setCameras(_cameras);
    setAudioInput(_mics);
    setAudioOutput(_speakers);
  }, []);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    start({ video: !isCameraOn, audio: isMicOn });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    start({ video: isCameraOn, audio: !isMicOn });
  };

  const attachSinkId = (sinkId: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /*@ts-ignore*/
    if (typeof videoElement.current?.sinkId !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /*@ts-ignore*/
      videoElement.current.setSinkId(sinkId).catch((error: unknown) => {
        console.log(error);
      });
    } else {
      console.warn("Browser does not support output device selection.");
    }
  };

  const start = async (
    state: { audio: boolean; video: boolean },
    firstStart?: boolean,
    devices?: DevicesValue
  ) => {
    if (stream.current) {
      stream?.current?.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const audioSource = devices?.mic?.value ?? devicesValue.mic?.value;
    const videoSource = devices?.camera?.value ?? devicesValue.camera?.value;
    const constraints: MediaStreamConstraints = {
      audio: state.audio
        ? { deviceId: audioSource ? { exact: audioSource } : undefined }
        : false,
      video: state.video
        ? { deviceId: videoSource ? { exact: videoSource } : undefined }
        : false,
    };
    console.log(constraints);
    setGeneratedStream(true);
    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then((_stream) => {
        if (!state.video) {
          _stream?.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.stop();
            }
          });
        }
        if (!state.audio) {
          _stream?.getTracks().forEach((track) => {
            if (track.kind === "audio") {
              track.stop();
            }
          });
        }
        return _stream;
      })
      .then(gotStream)
      .then((devices) => {
        if (firstStart) {
          gotDevices(devices);
        }
      });
  };

  useEffect(() => {
    start({ audio: isMicOn, video: isCameraOn }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDevice = useCallback(
    (value: DevicesValue) => {
      setDevicesValue(value);
      start({ audio: isMicOn, video: isCameraOn }, false, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCameraOn, isMicOn]
  );

  const handleChageSpeaker = useCallback(
    (value: DevicesValue) => {
      setDevicesValue(value);
      attachSinkId(value.speaker?.value ?? audioOutput[0].value);
    },
    [audioOutput]
  );

  return (
    <div className="flex h-screen w-full justify-center bg-darkBlue">
      {settings && (
        <DesktopSettings
          setSettings={setSettings}
          devices={{ cameras, audioOutput, audioInput }}
          setValue={handleChangeDevice}
          value={devicesValue}
          setSpeaker={handleChageSpeaker}
          setCheckAudio={setCheckAudio}
        />
      )}
      <div className="mt-20 flex w-[600px] flex-col items-center gap-4">
        <p className="m-0 p-0 text-Bold32 text-white">
          {t("OnlineConsultation")}
        </p>
        <p className="m-0 p-0 text-Medium16 text-emphasis">
          {tDesktop("CheckMicrophoneCameraSettingsBeforeConsultation")}
        </p>
        {generatedStream ? (
          <video
            ref={videoElement}
            autoPlay
            muted={!checkAudio}
            className="mt-10 flex h-[383px] w-full flex-col items-center
                        justify-center gap-3 rounded-xl bg-surfaceDark"
          />
        ) : (
          <div
            className="mt-10 flex h-[383px] w-full flex-col items-center
                        justify-center gap-3 rounded-xl bg-surfaceDark"
          >
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-twinPurple">
              <p className="m-0 p-0 text-Semibold48 text-white">KA</p>
            </div>
            <p className="m-0 p-0 text-Regular14 text-iconDisabled">
              Аббасов E.
            </p>
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex gap-3">
            <Button
              className="flex !h-12 !w-12 items-center justify-center
                            !rounded-xl !bg-borderLight"
              variant="tertiary"
              onClick={toggleMic}
            >
              <MicIcon color={isMicOn ? "white" : "iconDisabled"} />
            </Button>
            <Button
              className="flex !h-12 !w-12 items-center justify-center !rounded-xl !bg-borderLight"
              variant="tertiary"
              onClick={toggleCamera}
            >
              <VideoCameraIcon color={isCameraOn ? "white" : "iconDisabled"} />
            </Button>
          </div>
          <Button
            onClick={() => setSettings(true)}
            className="flex !h-12 !w-12 items-center justify-center !rounded-xl !bg-borderLight"
            variant="tertiary"
          >
            <GearIcon />
          </Button>
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="h-12 w-[421px] rounded-xl border border-solid border-borderLight bg-surfaceLight p-3">
            <p className="m-0 p-0 text-Regular16 text-highEmphasis">
              {chatRoomName}
            </p>
          </div>
          <div className="rounded-xl bg-brand-primary p-3">
            <Button
              className="m-0 h-3 p-0"
              onClick={startCall}
              variant="tertiary"
              disabled={!stream.current}
            >
              {tDesktop("Join")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
