import type { FC } from "react";

import { CloseOutlined, PhoneOutlined } from "@ant-design/icons";

import { Button, Dialog } from "@/shared/components";

export const CallAnswer: FC<{
  accept: () => void;
  decline: () => void;
  isMicOn: boolean;
  isOpen: boolean;
  isSpeakerOn: boolean;
  name: string;
  toggleMic: (val: boolean) => void;
  toggleSpeaker: (val: boolean) => void;
}> = ({
  isOpen,
  name,
  accept,
  decline,
  toggleMic,
  toggleSpeaker,
  isMicOn,
  isSpeakerOn,
}) => (
  <Dialog
    isOpen={isOpen}
    className="relative h-screen bg-gradient-to-b from-sky-400 to-sky-200"
  >
    <div className="my-3 text-[36px] font-light text-white">{name}</div>
    <div className="text-Medium16 uppercase text-white">Входящий звонок</div>
    <div className="absolute bottom-28 left-0 w-full  px-4">
      <div className="flex w-full justify-between ">
        <Button
          className="h-20 !w-20 rounded-full bg-green-500 text-white"
          icon={<PhoneOutlined style={{ fontSize: "30px" }} />}
          onClick={() => accept()}
        />
        <Button
          className="h-20 !w-20 rounded-full bg-red text-white"
          icon={<CloseOutlined style={{ fontSize: "30px" }} />}
          onClick={() => decline()}
        />
      </div>
      <div className="flex w-full justify-around">
        <Button
          className="h-20 !w-20 rounded-full text-white"
          variant="tertiary"
          onClick={() => toggleMic(!isMicOn)}
        >
          Mic {isMicOn ? "on" : "off"}
        </Button>
        <Button
          className="h-20 !w-20 rounded-full bg-red text-white"
          variant="tertiary"
          onClick={() => toggleSpeaker(!isSpeakerOn)}
        >
          Speaker {isSpeakerOn ? "on" : "off"}
        </Button>
      </div>
    </div>
  </Dialog>
);
