import { For, Match, Switch, createSignal } from "solid-js";
import { ProcessDialog } from "../dialog/process-dialog";
import { useDialog, useModel } from "../../context";
import "./process-list.css";
import { ProcessEntity } from "../../models/process-model";

export function ProcessList() {
  const {
    process: {
      processList,
      selectedProcess,
      setSelectedProcess,
      addProcess,
      removeProcess,
    },
  } = useModel();
  const {
    process: { setOpenProcessDialog },
  } = useDialog();

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let clickCouunt = 0;
  function handleItemClick(item: ProcessEntity, _: MouseEvent) {
    clickCouunt++;
    if (clickCouunt < 2) {
      setTimeout(() => {
        setSelectedProcess(item);
        if (clickCouunt > 1) {
          // double click
          setOpenProcessDialog(true);
        }
        clickCouunt = 0;
      }, 200);
    }
  }

  function handleAddClick(_: MouseEvent) {
    addProcess();
  }

  function handleRemoveClick(_: MouseEvent) {
    removeProcess();
  }

  return (
    <>
      <div class="process-list-area">
        <h5>プロセス</h5>
        <div class="list-scroll">
          <ul class="list">
            <For each={processList()}>
              {(item) => (
                <Switch>
                  <Match when={item.id === selectedProcess().id}>
                    <li
                      class="list-item list-item-selected"
                      onClick={[handleItemClick, item]}
                    >
                      {item.title}
                    </li>
                  </Match>
                  <Match when={item.id !== selectedProcess().id}>
                    <li class="list-item" onClick={[handleItemClick, item]}>
                      {item.title}
                    </li>
                  </Match>
                </Switch>
              )}
            </For>
          </ul>
        </div>
        <div>
          <button onClick={handleAddClick}>追加</button>
          <button
            onClick={handleRemoveClick}
            disabled={processList().length === 1}
          >
            削除
          </button>
        </div>
      </div>
    </>
  );
}
