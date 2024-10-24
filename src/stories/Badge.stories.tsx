import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Badge, ChatIcon } from "@/shared/components";

export default {
  title: "OneClinic/Badge",
  component: Badge,
  argTypes: {
    type: {
      type: "select",
      options: ["positive", "warning", "neutral", "red"],
    },
  },
} as unknown as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => (
  <Badge {...args}>
    <ChatIcon />
  </Badge>
);

export const Positive = Template.bind({});
Positive.args = {
  text: "2",
  type: "positive",
};

export const Warning = Template.bind({});
Warning.args = {
  text: "3",
  type: "warning",
};

export const Red = Template.bind({});
Red.args = {
  text: "4",
  type: "red",
};
