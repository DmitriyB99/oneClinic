import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { DividerSaunet } from "@/shared/components";

export default {
  title: "OneClinic/Divider",
  component: DividerSaunet,
  argTypes: {},
} as unknown as ComponentMeta<typeof DividerSaunet>;

const Template: ComponentStory<typeof DividerSaunet> = (args) => (
  <DividerSaunet {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
