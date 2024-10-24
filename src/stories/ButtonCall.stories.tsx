import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  ButtonCall,
  CameraIcon,
  CloseIcon,
  MicIcon,
  SoundIcon,
} from "@/shared/components";

export default {
  title: "OneClinic/ButtonCall",
  component: ButtonCall,
} as unknown as ComponentMeta<typeof ButtonCall>;

const Template: ComponentStory<typeof ButtonCall> = (args) => (
  <ButtonCall {...args} />
);

export const Default = Template.bind({});
Default.args = {
  icon: <CameraIcon />,
  title: "Вкл. камеру",
};

export const CallToolBarTemplate: ComponentStory<typeof ButtonCall> = () => (
  <div className="absolute bottom-3 left-0 flex w-full justify-around">
    <ButtonCall title="Вкл. камеру" icon={<CameraIcon />} />
    <ButtonCall title="Откл. микрофон" icon={<MicIcon />} />
    <ButtonCall title="Вкл. динамик" icon={<SoundIcon />} />
    <ButtonCall title="Завершить вызов" icon={<CloseIcon />} isDanger />
  </div>
);
