import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Avatar, UserIcon } from "shared/components";
import type { AvatarSize } from "shared/components";

const AvatarSizes: AvatarSize[] = ["s", "m", "l", "xl"];

export default {
  title: "OneClinic/Avatar",
  component: Avatar,
  argTypes: {
    size: { type: "select", options: AvatarSizes },
  },
} as unknown as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

export const Image = Template.bind({});
Image.args = {
  size: "m",
  src: "https://pbs.twimg.com/profile_images/632044486013513728/XiUNGqqa_400x400.jpg",
};

export const Icon = Template.bind({});
Icon.args = {
  size: "m",
  className: "bg-transparent",
  icon: <UserIcon size="lg" color="gray-icon" />,
};

export const Text = Template.bind({});
Text.args = {
  size: "m",
  text: "TN",
};
