import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { DefaultCell, ChatIcon, Toggle } from "@/shared/components";

export default {
  title: "OneClinic/DefaultCell",
  component: DefaultCell,
  argTypes: {
    caption: {
      type: "string",
    },
    subheading: {
      type: "string",
    },
    title: {
      type: "string",
    },
  },
} as unknown as ComponentMeta<typeof DefaultCell>;

const Template: ComponentStory<typeof DefaultCell> = (args) => (
  <DefaultCell {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Default title",
  subheading: "Default subheading",
  caption: "Default caption",
  mainIcon: <ChatIcon />,
  rightElement: <Toggle />,
};
