import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { SegmentedControl } from "@/shared/components";

export default {
  title: "OneClinic/SegmentedControl",
  component: SegmentedControl,
  argTypes: {
    size: {
      type: "select",
      options: ["m", "l"],
    },
    options: {
      type: "array",
    },
  },
} as unknown as ComponentMeta<typeof SegmentedControl>;

const Template: ComponentStory<typeof SegmentedControl> = (args) => (
  <SegmentedControl {...args} />
);

export const TwoOptionsMedium = Template.bind({});
TwoOptionsMedium.args = {
  size: "m",
  options: ["option 1", "option 2"],
};

export const TwoOptionsLarge = Template.bind({});
TwoOptionsLarge.args = {
  size: "l",
  options: ["option 1", "option 2"],
};

export const ThreeOptionsMedium = Template.bind({});
ThreeOptionsMedium.args = {
  size: "m",
  options: ["option 1", "option 2", "option 3"],
};

export const ThreeOptionsLarge = Template.bind({});
ThreeOptionsLarge.args = {
  size: "l",
  options: ["option 1", "option 2", "option 3"],
};
