import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { LinkSaunet } from "@/shared/components";

export default {
  title: "OneClinic/LinkSaunet",
  component: LinkSaunet,
  argTypes: {
    size: {
      type: "select",
      options: ["s", "m", "l"],
    },
  },
} as unknown as ComponentMeta<typeof LinkSaunet>;

const Template: ComponentStory<typeof LinkSaunet> = (args) => (
  <LinkSaunet {...args} />
);

export const Small = Template.bind({});
Small.args = {
  size: "s",
  children: "I am small",
  href: "https://www.google.com/",
};

export const Medium = Template.bind({});
Medium.args = {
  size: "m",
  children: "I am medium",
  href: "https://www.google.com/",
};

export const Large = Template.bind({});
Large.args = {
  size: "l",
  children: "I am large",
  href: "https://www.google.com/",
};
