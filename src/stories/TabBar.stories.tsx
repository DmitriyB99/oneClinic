import React from "react";

import type { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  ChatIcon,
  HomeHeartIcon,
  MobileTabBar,
  SearchIcon,
  UserCircleIcon,
} from "@/shared/components";

export default {
  title: "OneClinic/Tabbar",
  component: MobileTabBar,
} as unknown as ComponentMeta<typeof MobileTabBar>;

const Template: ComponentStory<typeof MobileTabBar> = (args) => (
  <MobileTabBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  items: [
    { title: "Главная", isActive: true, icon: <HomeHeartIcon /> },
    { title: "Поиск", icon: <SearchIcon /> },
    { title: "Сообщения", badge: "1", icon: <ChatIcon /> },
    { title: "Профиль", icon: <UserCircleIcon /> },
  ],
};
