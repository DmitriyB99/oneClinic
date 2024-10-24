import type { FC } from "react";
import { Fragment, useState } from "react";

import {
  ArrowLeftIcon,
  Dialog,
  Navbar,
  RadioSaunet,
} from "@/shared/components";

interface MyConfidentialitySettingsDialogueProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  whoSeesMySetting: string;
}

const whoSeesMySettingList = [
  {
    id: 0,
    title: "Все",
  },
  {
    id: 1,
    title: "Мои врачи",
  },
  {
    id: 2,
    title: "никто",
  },
];

export const MyConfidentialitySettingsDialogue: FC<MyConfidentialitySettingsDialogueProps> =
  ({ open, setIsOpen, title, whoSeesMySetting }) => {
    const [activeSetting, setActiveSetting] = useState<number>(0);
    return (
      <Dialog isOpen={open} setIsOpen={setIsOpen}>
        <Navbar
          title={title}
          leftButtonOnClick={() => {
            setIsOpen(false);
          }}
          buttonIcon={<ArrowLeftIcon />}
          className="mb-4 !p-0"
        />
        <div className="mb-4 text-Bold20">{whoSeesMySetting}</div>
        <div>
          {whoSeesMySettingList.map(({ id, title }) => (
            <Fragment key={id}>
              <div className="h-16">
                <RadioSaunet
                  checked={id === activeSetting}
                  onChange={() => {
                    setActiveSetting(id);
                  }}
                />
                {title}
              </div>
            </Fragment>
          ))}
        </div>
      </Dialog>
    );
  };
