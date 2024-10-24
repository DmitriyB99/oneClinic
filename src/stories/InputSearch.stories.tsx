import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { InputSearch } from "@/shared/components";

export default {
  title: "OneClinic/InputSearch",
  component: InputSearch,
} as unknown as ComponentMeta<typeof InputSearch>;

const Template: ComponentStory<typeof InputSearch> = (args) => (
  <InputSearch {...args} />
);

export const DefaultInputSearch = Template.bind({});
