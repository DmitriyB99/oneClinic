import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { UserIcon } from "shared/components";

const Sizes: string[] = ["xs", "sm", "md", "lg", "xl", "xxl"];

export default {
  title: "OneClinic/Icons",
  component: UserIcon,
  argTypes: {
    size: { type: "select", options: Sizes },
  },
} as unknown as ComponentMeta<typeof UserIcon>;

const Template: ComponentStory<typeof UserIcon> = (args) => (
  <UserIcon {...args} />
);

export const Icon = Template.bind({});
Icon.args = {
  size: "xl",
};
