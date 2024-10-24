import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Calendar } from "@/shared/components";

export default {
  title: "OneClinic/Calendar",
  component: Calendar,
} as unknown as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = (args) => (
  <Calendar {...args} />
);

export const DefaultCalendar = Template.bind({});
DefaultCalendar.args = {
  onChange: (date) => {
    console.log(date);
  },
};
