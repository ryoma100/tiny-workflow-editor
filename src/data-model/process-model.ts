import { batch, createSignal } from "solid-js";

import { i18nEnDict } from "@/constants/i18n";
import { makeActorModel } from "@/data-model/actor-model";
import { makeEdgeModel } from "@/data-model/edge-model";
import { makeNodeModel } from "@/data-model/node-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ProcessEntity, ProjectEntity } from "@/data-source/data-type";

const dummy = dataFactory.createProcess([]);

export function makeProcessModel(
  actorModel: ReturnType<typeof makeActorModel>,
  nodeModel: ReturnType<typeof makeNodeModel>,
  edgeModel: ReturnType<typeof makeEdgeModel>,
) {
  const [processList, setProcessList] = createSignal<ProcessEntity[]>([]);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(dummy);

  function load(project: ProjectEntity) {
    setProcessList(project.processes);
    batch(() => {
      const firstProcess = processList()[0];
      setSelectedProcess(firstProcess);
      actorModel.load(firstProcess);
      nodeModel.load(firstProcess);
      edgeModel.load(firstProcess);
    });
  }

  function save(): ProcessEntity[] {
    const process: ProcessEntity = {
      ...selectedProcess(),
      actors: actorModel.save(),
      nodeList: nodeModel.save(),
      edgeList: edgeModel.save(),
    };
    setProcessList(processList().map((it) => (it.id === process.id ? process : it)));
    setSelectedProcess(processList().find((it) => it.id === process.id)!);
    return deepUnwrap(processList());
  }

  function changeProcess(newProcess: ProcessEntity) {
    save();
    const process = processList().find((it) => it.id === newProcess.id)!;
    batch(() => {
      setSelectedProcess(process);
      actorModel.load(process);
      nodeModel.load(process);
      edgeModel.load(process);
    });
  }

  function addProcess(processes: ProcessEntity[]) {
    const newProcess = dataFactory.createProcess(processes);
    setProcessList([...processList(), newProcess]);
    changeProcess(newProcess);
  }

  function updateProcessDetail(process: ProcessEntity): keyof typeof i18nEnDict | undefined {
    if (
      processList().some((it) => it.id !== process.id && it.detail.xpdlId === process.detail.xpdlId)
    ) {
      return "idExists";
    }
    if (
      new Set(process.detail.applications.map((it) => it.xpdlId)).size !==
      process.detail.applications.length
    ) {
      return "duplicateApplicationId";
    }

    setProcessList(processList().map((it) => (process.id === it.id ? process : it)));
    setSelectedProcess(processList().find((it) => it.id === process.id)!);
  }

  function removeProcess(process: ProcessEntity) {
    if (processList().length <= 1) {
      return;
    }

    const nextSelectedIndex = Math.min(
      processList().findIndex((it) => it.id === process.id),
      processList().length - 2,
    );
    const newList = processList().filter((it) => it.id !== process.id);
    setProcessList(newList);
    setSelectedProcess(processList()[nextSelectedIndex]);
    changeProcess(selectedProcess());
  }

  return {
    load,
    save,
    processList,
    selectedProcess,
    changeProcess,
    addProcess,
    updateProcessDetail,
    removeProcess,
  };
}
