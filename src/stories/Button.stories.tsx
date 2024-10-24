import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "@/shared/components";

export default {
  title: "OneClinic/Button",
  component: Button,
  argTypes: {
    size: { type: "select", options: ["s", "m"] },
    type: {
      type: "select",
      options: ["primary", "secondary", "tertiary", "tinted"],
    },
    block: { type: "boolean" },
  },
} as unknown as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Button",
};
