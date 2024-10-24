import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Chips } from "@/shared/components";

export default {
  title: "OneClinic/Chips",
  component: Chips,
  argTypes: {
    type: {
      type: "select",
      options: ["multiselect", "suggest", "single"],
    },
  },
} as unknown as ComponentMeta<typeof Chips>;

const Template: ComponentStory<typeof Chips> = (args) => <Chips {...args} />;

export const Multiselect = Template.bind({});
Multiselect.args = {
  type: "multiselect",
  chipLabels: ["Chip 1", "Chip 2", "Chip 3"],
};

export const Suggest = Template.bind({});
Suggest.args = {
  type: "suggest",
  chipLabels: ["Chip 1", "Chip 2", "Chip 3"],
};

export const Single = Template.bind({});
Single.args = {
  type: "single",
  chipLabels: ["Chip 1", "Chip 2", "Chip 3"],
};
