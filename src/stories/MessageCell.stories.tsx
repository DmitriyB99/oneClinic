import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { MessageCell, ChatIcon } from "@/shared/components";

export default {
  title: "OneClinic/MessageCell",
  component: MessageCell,
  argTypes: {
    subheading: {
      type: "string",
    },
    title: {
      type: "string",
    },
    numberOfMessages: {
      type: "number",
    },
    messageTime: {
      type: "string",
    },
  },
} as unknown as ComponentMeta<typeof MessageCell>;

const Template: ComponentStory<typeof MessageCell> = (args) => (
  <MessageCell {...args} />
);

export const Message = Template.bind({});
Message.args = {
  mainIcon: <ChatIcon />,
  title: "Message title",
  subheading: "Message subheading",
  messageTime: "12:00",
  numberOfMessages: 3,
};
