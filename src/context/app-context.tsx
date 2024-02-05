import { JSX, createContext, createSignal, useContext } from "solid-js";
import { createPackageModel } from "../data-model/package-model";
import { createActorModel } from "../data-model/actor-model";
import { createActivityModel } from "../data-model/activity-model";
import { createTransitionModel } from "../data-model/transition-model";
import { createProcessModel } from "../data-model/process-model";
import { ToolbarType } from "../components/toolbar/toolbar";
import { DragType } from "../components/diagram/disgram";
import { createCommentModel } from "../data-model/comment-model";
import {
  ActivityEntity,
  ActorEntity,
  PackageEntity,
  ProcessEntity,
  TransitionEntity,
} from "../data-source/data-type";

const AppContext = createContext<{
  packageModel: ReturnType<typeof createPackageModel>;
  processModel: ReturnType<typeof createProcessModel>;
  actorModel: ReturnType<typeof createActorModel>;
  activityModel: ReturnType<typeof createActivityModel>;
  transitionModel: ReturnType<typeof createTransitionModel>;
  commentModel: ReturnType<typeof createCommentModel>;
  dialog: ReturnType<typeof createDialogContext>;
  diagram: ReturnType<typeof createDiagramContext>;
}>({
  packageModel: null as any,
  processModel: null as any,
  actorModel: null as any,
  activityModel: null as any,
  transitionModel: null as any,
  commentModel: null as any,
  dialog: null as any,
  diagram: null as any,
});

function createModelContext() {
  const packageModel = createPackageModel();
  const actorModel = createActorModel();
  const activityModel = createActivityModel(actorModel);
  const transitionModel = createTransitionModel(activityModel);
  const commentModel = createCommentModel();
  const processModel = createProcessModel(
    actorModel,
    activityModel,
    transitionModel,
    commentModel
  );

  return {
    packageModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
    commentModel,
  };
}

function createDialogContext() {
  const [openPackageDialog, setOpenPackageDialog] =
    createSignal<PackageEntity | null>(null);
  const [openProcessDialog, setOpenProcessDialog] =
    createSignal<ProcessEntity | null>(null);
  const [openActorDialog, setOpenActorDialog] =
    createSignal<ActorEntity | null>(null);
  const [openActivityDialog, setOpenActivityDialog] =
    createSignal<ActivityEntity | null>(null);
  const [openTransitionDialog, setOpenTransitionDialog] =
    createSignal<TransitionEntity | null>(null);

  return {
    openPackageDialog,
    setOpenPackageDialog,
    openProcessDialog,
    setOpenProcessDialog,
    openActorDialog,
    setOpenActorDialog,
    openActivityDialog,
    setOpenActivityDialog,
    openTransitionDialog,
    setOpenTransitionDialog,
  };
}

function createDiagramContext() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>(null as any);

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLine,
  };
}

export function AppProvider(props: { children: JSX.Element }) {
  const value = {
    ...createModelContext(),
    dialog: createDialogContext(),
    diagram: createDiagramContext(),
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
