import type { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Badge } from "@/shared/components";
import { Toggle } from "@/shared/components";

export default {
  title: "OneClinic/Toggle",
  component: Toggle,
} as unknown as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Badge> = (args) => <Toggle {...args} />;

export const ToggleExample = Template.bind({});
