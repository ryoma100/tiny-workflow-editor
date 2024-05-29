import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createEffect, createMemo, createSignal, useContext } from "solid-js";

import { i18nEnDict } from "@/constants/i18n";
import { i18nJaDict } from "@/constants/i18n-ja";
import { makeActivityModel } from "@/data-model/activity-node-model";
import { makeActorModel } from "@/data-model/actor-model";
import { makeDiagramModel } from "@/data-model/diagram-model";
import { makeEdgeModel } from "@/data-model/edge-model";
import { makeExtendEdgeModel } from "@/data-model/extend-edge-model";
import { makeExtendNodeModel } from "@/data-model/extend-node-model";
import { makeNodeModel } from "@/data-model/node-model";
import { makeProcessModel } from "@/data-model/process-model";
import { makeProjectModel } from "@/data-model/project-model";
import { makeTransactionEdgeModel } from "@/data-model/transaction-edge-model";
import { setDataFactoryDict } from "@/data-source/data-factory";
import {
  ActivityNode,
  ActorEntity,
  CommentNode,
  ProcessEntity,
  ProjectEntity,
  TransitionEdge,
} from "@/data-source/data-type";

export type Theme = "material" | "crab";
export type Color = "green" | "red";
const themeColorMap: Record<Theme, Color> = { material: "green", crab: "red" };

function makeI18nContext() {
  const LOCALE_KEY = "locale";
  const defaultLocale = (localStorage.getItem(LOCALE_KEY) || navigator.language)
    .toLowerCase()
    .startsWith("ja")
    ? "ja"
    : "en";

  const THEME_KEY = "theme";
  const defaultTheme = (localStorage.getItem(THEME_KEY) as Theme) || "material";
  const COLOR_KEY = "color";
  const defaultColor = (localStorage.getItem(COLOR_KEY) as Color) || "green";

  const dictionaries = { ja: i18nJaDict, en: i18nEnDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>(defaultLocale);
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  createEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale());
    setDataFactoryDict(dict());
  });

  const [color, setColor] = createSignal<Color>(defaultColor);
  createEffect(() => {
    localStorage.setItem(COLOR_KEY, color());
  });

  const [theme, setTheme] = createSignal<Theme>(defaultTheme);
  createEffect(() => {
    localStorage.setItem(THEME_KEY, theme());
    setColor(themeColorMap[theme()]);
  });

  return { dict, locale, setLocale, theme, setTheme, color, setColor };
}

function makeModelContext() {
  const actorModel = makeActorModel();
  const nodeModel = makeNodeModel();
  const edgeModel = makeEdgeModel(nodeModel);
  const processModel = makeProcessModel(actorModel, nodeModel, edgeModel);
  const projectModel = makeProjectModel(processModel);
  const diagramModel = makeDiagramModel(nodeModel, edgeModel);

  const activityNodeModel = makeActivityModel(nodeModel);
  const transitionEdgeModel = makeTransactionEdgeModel(edgeModel, nodeModel);
  const extendNodeModel = makeExtendNodeModel(nodeModel);
  const extendEdgeModel = makeExtendEdgeModel(edgeModel, nodeModel);

  return {
    actorModel,
    nodeModel,
    edgeModel,
    processModel,
    projectModel,
    diagramModel,
    activityNodeModel,
    transitionEdgeModel,
    extendNodeModel,
    extendEdgeModel,
  };
}

export type ModalDialogType =
  | { type: "initAll" }
  | { type: "load" }
  | { type: "save"; project: ProjectEntity }
  | { type: "setting" }
  | { type: "project"; project: ProjectEntity }
  | { type: "process"; process: ProcessEntity }
  | { type: "deleteProcess"; process: ProcessEntity }
  | { type: "actor"; actor: ActorEntity }
  | { type: "activity"; activity: ActivityNode }
  | { type: "transition"; transition: TransitionEdge }
  | { type: "comment"; comment: CommentNode }
  | { type: "about" };

function makeDialogContext() {
  const [modalDialog, setModalDialog] = createSignal<ModalDialogType | null>(null);
  const [messageAlert, setMessageAlert] = createSignal<keyof typeof i18nEnDict | null>(null);

  return {
    modalDialog,
    setModalDialog,
    messageAlert,
    setMessageAlert,
  };
}

const appContextValue = {
  i18n: makeI18nContext(),
  ...makeModelContext(),
  dialog: makeDialogContext(),
};

const AppContext = createContext<{
  i18n: ReturnType<typeof makeI18nContext>;
  actorModel: ReturnType<typeof makeActorModel>;
  nodeModel: ReturnType<typeof makeNodeModel>;
  edgeModel: ReturnType<typeof makeEdgeModel>;
  processModel: ReturnType<typeof makeProcessModel>;
  projectModel: ReturnType<typeof makeProjectModel>;
  activityNodeModel: ReturnType<typeof makeActivityModel>;
  transitionEdgeModel: ReturnType<typeof makeTransactionEdgeModel>;
  extendNodeModel: ReturnType<typeof makeExtendNodeModel>;
  extendEdgeModel: ReturnType<typeof makeExtendEdgeModel>;
  diagramModel: ReturnType<typeof makeDiagramModel>;
  dialog: ReturnType<typeof makeDialogContext>;
}>(appContextValue);

export function AppProvider(props: { children: JSX.Element }) {
  return <AppContext.Provider value={appContextValue}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
