import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { InputCode } from "@/shared/components";

export default {
  title: "OneClinic/InputCode",
  component: InputCode,
  argTypes: {
    length: {
      type: "number",
    },
  },
} as unknown as ComponentMeta<typeof InputCode>;

const Template: ComponentStory<typeof InputCode> = (args) => (
  <InputCode {...args} />
);

export const DefaultInputCode = Template.bind({});
