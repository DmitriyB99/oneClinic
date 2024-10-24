import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Checkbox } from "@/shared/components";

export default {
  title: "OneClinic/Checkbox",
  component: Checkbox,
} as unknown as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const DefaultCheckbox = Template.bind({});

export const CheckboxWithChildren = Template.bind({});
CheckboxWithChildren.args = {
  children: "I am a checkbox!",
};
