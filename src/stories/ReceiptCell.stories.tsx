import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ReceiptCell, ChatIcon } from "@/shared/components";

export default {
  title: "OneClinic/ReceiptCell",
  component: ReceiptCell,
  argTypes: {
    caption: {
      type: "string",
    },
    title: {
      type: "string",
    },
    receiptDays: {
      type: "string",
    },
  },
} as unknown as ComponentMeta<typeof ReceiptCell>;

const Template: ComponentStory<typeof ReceiptCell> = (args) => (
  <ReceiptCell {...args} />
);

export const Receipt = Template.bind({});
Receipt.args = {
  mainIcon: <ChatIcon />,
  title: "Receipt title",
  caption: "Receipt caption",
  receiptDays: "4",
};
