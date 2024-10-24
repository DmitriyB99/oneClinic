import { useState } from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, Dialog } from "@/shared/components";

export default {
  title: "OneClinic/Dialog",
  component: Dialog,
  argTypes: {
    title: { type: "string" },
    children: { type: "string" },
  },
} as unknown as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog {...args} isOpen={open} setIsOpen={() => setOpen(false)} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = { title: "Title", children: <div>test message</div> };
