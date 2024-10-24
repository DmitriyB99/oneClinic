import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ProgressBar } from "@/shared/components";

export default {
  title: "OneClinic/ProgressBar",
  component: ProgressBar,
  argTypes: {
    percent: {
      type: "number",
    },
  },
} as unknown as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
);

export const ZeroPercent = Template.bind({});
ZeroPercent.args = {
  percent: 0,
};
export const TwentyPercent = Template.bind({});
TwentyPercent.args = {
  percent: 20,
};
export const FiftyPercent = Template.bind({});
FiftyPercent.args = {
  percent: 50,
};
export const SeventyFivePercent = Template.bind({});
SeventyFivePercent.args = {
  percent: 75,
};
export const Full = Template.bind({});
Full.args = {
  percent: 100,
};
//
// export const Warning = Template.bind({});
// Warning.args = {
//   text: "3",
//   type: "warning",
// };
//
// export const Red = Template.bind({});
// Red.args = {
//   text: "4",
//   type: "red",
// };
