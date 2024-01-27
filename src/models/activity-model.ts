import { createStore, produce } from "solid-js/store";

export type ActvityType = "manual" | "auto" | "hand";

export type ActivityEntity = {
  id: number;
  xpdlId: string;
  type: ActvityType;
  actorId: number;
  title: string;
  selected: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

let nextActivityId = 1;

export function activityModel() {
  const [activityList, setActivityList] = createStore<ActivityEntity[]>([]);

  function addActivity(type: ActvityType, x: number, y: number): number {
    const id = nextActivityId;
    const entity: ActivityEntity = {
      id,
      xpdlId: `newpkg_wp1_act${nextActivityId}`,
      type,
      title: "",
      actorId: 0,
      selected: false,
      x,
      y,
      width: 100,
      height: 100,
    };
    nextActivityId++;
    setActivityList([...activityList, entity]);
    return id;
  }

  function moveSelectedActivities(moveX: number, moveY: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      })
    );
  }

  function selectActivities(ids: number[]) {
    setActivityList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      })
    );
  }

  function toggleSelectActivity(id: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      })
    );
  }

  function layerTopActivity(id: number) {
    const target = activityList.find((it) => it.id === id)!;
    const listWithoutTarget = activityList.filter((it) => it.id !== id);
    setActivityList([...listWithoutTarget, target]);
  }

  function resizeLeft(id: number, moveX: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        if (100 <= it.width - moveX) {
          it.x += moveX / 2;
          it.width -= moveX;
        }
      })
    );
  }

  function resizeRight(id: number, moveX: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        if (100 <= it.width + moveX) {
          it.x += moveX / 2;
          it.width += moveX;
        }
      })
    );
  }

  return {
    activityList,
    setActivityList,
    addActivity,
    moveSelectedActivities,
    resizeLeft,
    resizeRight,
    layerTopActivity,
    selectActivities,
    toggleSelectActivity,
  };
}