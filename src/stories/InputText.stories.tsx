import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { InputText, UserIcon } from "@/shared/components";

export default {
  title: "OneClinic/InputText",
  component: InputText,
  argTypes: {
    isError: { type: "boolean" },
    isPhone: { type: "boolean" },
    isSuccess: { type: "boolean" },
    label: {
      type: "string",
    },
    bottomText: {
      type: "string",
    },
  },
} as unknown as ComponentMeta<typeof InputText>;

const Template: ComponentStory<typeof InputText> = (args) => (
  <InputText {...args} />
);

export const PhoneInput = Template.bind({});
PhoneInput.args = {
  isPhone: true,
  isError: false,
  isSuccess: false,
  label: "label",
  bottomText: "hint",
};

export const TextInput = Template.bind({});
TextInput.args = {
  isPhone: false,
  isError: false,
  isSuccess: false,
  label: "label",
  bottomText: "hint",
};

export const PhoneInputIcon = Template.bind({});
PhoneInputIcon.args = {
  isPhone: true,
  isError: false,
  isSuccess: false,
  label: "label",
  bottomText: "hint",
  icon: <UserIcon size="md" color="gray-icon" />,
};

export const TextInputIcon = Template.bind({});
TextInputIcon.args = {
  isPhone: false,
  isError: false,
  isSuccess: false,
  label: "label",
  bottomText: "hint",
  icon: <UserIcon size="md" color="gray-icon" />,
};
