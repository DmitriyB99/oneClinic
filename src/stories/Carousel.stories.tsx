import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Carousel, CarouselSlide } from "@/shared/components";

export default {
  title: "OneClinic/Carousel",
  component: Carousel,
} as unknown as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => (
  <Carousel
    {...args}
    className="mx-5"
    customSlides
    items={Array.from(Array(20).keys()).map((el) => (
      <CarouselSlide key={el} isNew src="/havka.png">
        Как укрепить иммунитет осенью?
      </CarouselSlide>
    ))}
  />
);

export const Default = Template.bind({});
Default.args = {};
