import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { CarouselSlide } from "@/shared/components";

export default {
  title: "OneClinic/CarouselSlide",
  component: CarouselSlide,
} as unknown as ComponentMeta<typeof CarouselSlide>;

const Template: ComponentStory<typeof CarouselSlide> = (args) => (
  <CarouselSlide {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Как укрепить иммунитет осенью?",
  src: "/havka.png",
};
