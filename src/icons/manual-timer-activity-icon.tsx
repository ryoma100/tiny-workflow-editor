import { Match, Switch } from "solid-js";

import ManualTimerActivitySvg from "@/assets/material-icons/manual-timer-activity.svg";
import { useThemeContext } from "@/context/theme-context";

export function ManualTimerActivityIcon() {
  const { theme } = useThemeContext();

  return (
    <Switch>
      <Match when={theme() === "material"}>
        <ManualTimerActivitySvg />
      </Match>
      <Match when={theme() === "crab"}>
        <img src="crab/manual-timer-activity.jpg" class="h-12 w-16" />
      </Match>
    </Switch>
  );
}
