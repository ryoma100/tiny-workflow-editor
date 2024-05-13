import type { Meta, StoryObj } from "storybook-solidjs";

import { LoadDialogView } from "@/components/dialog/load-dialog";
import { i18nEnDict } from "@/constants/i18n";

const meta = {
  title: "Dialog/Load",
  component: LoadDialogView,
  parameters: { layout: "centered" },
} satisfies Meta<typeof LoadDialogView>;
export default meta;

type Story = StoryObj<typeof LoadDialogView>;

export const Load: Story = {
  args: {
    openDialog: { type: "load" },
    dict: i18nEnDict,
  },
};
