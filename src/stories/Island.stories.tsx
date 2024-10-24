import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Island } from "@/shared/components";

export default {
  title: "OneClinic/Island",
  component: Island,
} as unknown as ComponentMeta<typeof Island>;

const Template: ComponentStory<typeof Island> = (args) => <Island {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Как укрепить иммунитет осенью?",
};
