import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { AutocompleteSaunet } from "@/shared/components";

export default {
  title: "OneClinic/AutocompleteSaunet",
  component: AutocompleteSaunet,
  argTypes: {
    label: {
      type: "string",
    },
    options: {
      type: "array",
    },
  },
} as unknown as ComponentMeta<typeof AutocompleteSaunet>;

const Template: ComponentStory<typeof AutocompleteSaunet> = (args) => (
  <AutocompleteSaunet {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "AutocompleteSaunet",
  options: [
    {
      label: "label1",
      value: "value1",
    },
    {
      label: "label2",
      value: "value2",
    },
    {
      label: "label3",
      value: "value3",
    },
  ],
};
