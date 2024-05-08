import { dialog } from "@tauri-apps/api";
import { writeTextFile } from "@tauri-apps/api/fs";
import { JSXElement, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { enDict } from "@/constants/i18n-en";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { exportXml } from "@/data-source/data-converter";

export function SaveDialog(): JSXElement {
  const {
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    i18n: { dict },
  } = useAppContext();

  function handleFormSubmit(formData: string) {
    if ("__TAURI_IPC__" in window) {
      tauriSave(formData);
    } else {
      webSave(formData);
    }
    setOpenDialog(null);
  }

  function webSave(data: string) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = "flow.xml";
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function tauriSave(data: string) {
    const filename = "flow.xml";
    const path = await dialog.save({ defaultPath: filename });
    if (path) {
      await writeTextFile(path, data);
    }
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <SaveDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function SaveDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: typeof enDict;
  onFormSubmit?: (formData: string) => void;
  onDialogClose?: () => void;
}) {
  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (props.openDialog?.type === "save") {
      dialogRef?.showModal();
      saveButtonRef?.focus();
      setData(exportXml(props.openDialog.project));
    } else {
      dialogRef?.close();
    }
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.(data());
  }

  let dialogRef: HTMLDialogElement | undefined;
  let saveButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="h-[536px] w-[768px] bg-primary2 p-2" ref={dialogRef}>
      <h5 class="mb-2">{props.dict.xpdlSave}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">下記のXPDLの内容をコピーペーストで保存してください。</p>
        <textarea class="mb-2 h-[410px] w-full resize-none" readOnly>
          {data()}
        </textarea>

        <ButtonsContainer>
          <button type="button" ref={saveButtonRef} onClick={handleFormSubmit}>
            ファイルに保存
          </button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            閉じる
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
