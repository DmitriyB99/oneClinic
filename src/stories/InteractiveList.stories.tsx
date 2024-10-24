import type { ComponentStory, ComponentMeta } from "@storybook/react";

import type { ListType } from "@/shared/components";
import { InteractiveList } from "@/shared/components";

const Specialties: ListType[] = [
  {
    title: "Терапевт",
    id: 1,
  },
  {
    title: "Педиатр",
    id: 2,
  },
  {
    title: "Хирург",
    id: 3,
  },
  {
    title: "Окулист",
    id: 4,
  },
  {
    title: "Лор",
    id: 5,
  },
  {
    title: "Стоматолог",
    id: 6,
  },
  {
    title: "Гастроэнтеролог",
    id: 7,
  },
  {
    title: "Гинеколог",
    id: 8,
  },
  {
    title: "Невролог",
    id: 9,
  },
];

export default {
  title: "OneClinic/InteractiveList",
  component: InteractiveList,
  argTypes: {
    maxItems: {
      type: "number",
    },
    list: {
      type: "array",
    },
  },
} as unknown as ComponentMeta<typeof InteractiveList>;

const Template: ComponentStory<typeof InteractiveList> = (args) => (
  <InteractiveList {...args} />
);

export const WithMaxCount = Template.bind({});
WithMaxCount.args = {
  maxItems: 3,
  list: Specialties,
  onClick: (id) => {
    console.log(id);
  },
};

export const WithoutMaxCount = Template.bind({});
WithMaxCount.args = {
  list: Specialties,
  onClick: (id) => {
    console.log(id);
  },
};
