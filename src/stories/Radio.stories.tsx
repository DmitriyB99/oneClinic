import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { RadioSaunet } from "@/shared/components";

export default {
  title: "OneClinic/RadioButton",
  component: RadioSaunet,
  argTypes: {
    disabled: { type: "boolean" },
    checked: { type: "boolean" },
    children: { type: "string" },
  },
} as unknown as ComponentMeta<typeof RadioSaunet>;

const Template: ComponentStory<typeof RadioSaunet> = (args) => (
  <RadioSaunet {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
