import { JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { TransitionEntity } from "../../data-source/data-type";
import "./transition-edge.css";

export function TransitionEdge(props: {
  transition: TransitionEntity;
}): JSXElement {
  const {
    activityModel: { activityList },
    dialog: { setOpenTransitionDialog },
  } = useAppContext();

  const fromActivity = () =>
    activityList.find((it) => it.id === props.transition.fromActivityId)!;
  const toActivity = () =>
    activityList.find((it) => it.id === props.transition.toActivityId)!;

  function onDlbClick(_e: MouseEvent) {
    setOpenTransitionDialog(props.transition);
  }

  return (
    <>
      <line
        class="transition"
        x1={fromActivity().x + fromActivity().width / 2}
        y1={fromActivity().y}
        x2={toActivity().x - toActivity().width / 2}
        y2={toActivity().y}
        marker-end="url(#arrow-end)"
      />
      <line
        class="transition--hover"
        onDblClick={onDlbClick}
        x1={fromActivity().x + fromActivity().width / 2}
        y1={fromActivity().y}
        x2={toActivity().x - toActivity().width / 2}
        y2={toActivity().y}
      />
    </>
  );
}
