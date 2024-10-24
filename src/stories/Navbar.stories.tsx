import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Navbar, ChatIcon } from "@/shared/components";

export default {
  title: "OneClinic/Navbar",
  component: Navbar,
  argTypes: {
    description: {
      type: "string",
    },
    title: {
      type: "string",
    },
  },
} as unknown as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

export const NoIcons = Template.bind({});
NoIcons.args = {
  description: "I am description",
  title: "I am title",
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  description: "I am description",
  title: "I am title",
  buttonIcon: <ChatIcon />,
};

export const RightIcon = Template.bind({});
RightIcon.args = {
  description: "I am description",
  title: "I am title",
  rightIcon: <ChatIcon />,
};

export const BothIcons = Template.bind({});
BothIcons.args = {
  description: "I am description",
  title: "I am title",
  buttonIcon: <ChatIcon />,
  rightIcon: <ChatIcon />,
};
