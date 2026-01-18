"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { useAuth } from "@/app/contexts/AuthProvider";
import { useHistory } from "@/app/contexts/HistoryProvider";
import { useDialog } from "@/app/contexts/DialogsProvider";
import { useDraft } from "@/app/contexts/DraftProvider";
import {
  addFile,
  Conversation,
  Message,
  MSG_TYPES,
  RequestError,
  sendMessage,
} from "@/app/services/services";
import Button from "../ui/Button";

export default function ChatInput() {
  const uploadFileLink = useRef<HTMLInputElement>(null);
  const { currentUser} = useAuth();
  const { currentChatId } = useHistory()
  const { addDialog, setDialogs } = useDialog();
  const { addDraft } = useDraft();
  const [loading, setLoading] = useState<boolean>(false);
  const [userNewMessage, setUserNewMessage] = useState<string>("");
  const [filesToSend, setFilesToSend] = useState<Array<string>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  function newMessage(message: Message): void {
    if (!!message && !!message.message.trim().length) {
      addDialog(message);
    } else {
      const errorMsg = "Mensagem não pode ser vazia";
      alert(errorMsg);
      console.error(errorMsg);
    }
  }

  async function handleSubmit(newMsg: string): Promise<void> {
    const chatId = currentChatId ? currentChatId : null
    const user = currentUser?.email ? currentUser.email : ""

    if (!newMsg.trim().length && !selectedFiles.length) {
      const errorMsg = "Mensagem não pode ser vazia";
      alert(errorMsg);
      console.error(errorMsg);
      return;
    }

    if (!!newMsg.trim().length) {
      newMessage({
        message: newMsg,
        msg_type: MSG_TYPES.USER_TEXT,
        timestamp: String(new Date()),
      });
    }

    setLoading(true);

    try {
      let uploadedIds: Array<string> = [];
      if (selectedFiles.length) {
        const res = await addFile(user, chatId, selectedFiles);
        if ((res as RequestError).errorMsg) throw (res as RequestError).errorMsg;
        uploadedIds = res as Array<string>;
      }

      const data: Conversation | RequestError = await sendMessage(user, chatId, newMsg, uploadedIds);

      setDialogs((data as Conversation).history);
      addDraft((data as Conversation).draft);
      setUserNewMessage("");
      setFilesToSend([]);
      setSelectedFiles([]);
      if (uploadFileLink.current) uploadFileLink.current.value = "";
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(event: FormEvent, newMsg: string): void {
    event.preventDefault();
    void handleSubmit(`${newMsg}`);
  }

  function handleKeyDown(event: KeyboardEvent, newMsg: string): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(newMsg);
    }
  }

  function removeFromSendList(itemToRemove: string): void {
    setFilesToSend((prev) => prev.filter((item) => item !== itemToRemove));
  }

  function saveFiles(files: Array<File>): void {
    if (files.length) {
      setSelectedFiles((prev) => prev.concat(files));
      if (uploadFileLink.current) uploadFileLink.current.value = "";
    }
  }

  function removeSelectedFile(indexToRemove: number): void {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  return (
    <>
      <hr className="text-verde-oliva-claro h-px my-4" />
      <form
        className="w-full flex items-start"
        onSubmit={(e) => handleFormSubmit(e, userNewMessage)}
      >
        <textarea
          value={userNewMessage}
          disabled={loading}
          onKeyDown={(e) => handleKeyDown(e, userNewMessage)}
          onChange={(e) => setUserNewMessage(e.target.value)}
          className="w-[calc(100%-120px)] bg-marfim text-marrom-carvao rounded-lg p-3 px-4 box-border leading-5 min-h-[80px] mr-4 disabled:cursor-progress disabled:opacity-30"
          placeholder="Escreva aqui sua mensagem... (Shift + Enter para quebrar linha)"
        />
        <div className="w-[120px] flex flex-col justify-between items-center gap-4">
          <Button
            size="sm"
            className="w-full"
            disabled={loading}
            type="submit"
          >
            Enviar
          </Button>
          <Button
            size="sm"
            className="w-full"
            disabled={loading}
            onClick={() => uploadFileLink.current?.click()}
            type="button"
          >
            Arquivo
          </Button>
          <input
            ref={uploadFileLink}
            type="file"
            multiple
            accept=".pdf,.txt,.md"
            alt="upload file"
            hidden
            onChange={(e) => saveFiles(Array.from(e.target?.files || []))}
          />
        </div>
      </form>

      <ul className="flex list-none flex-wrap -mx-2 mt-2">
        {selectedFiles.map((file: File, index: number) => (
          <li 
            className="relative rounded-lg bg-laranja-queimado text-marfim p-4 pr-14 pl-4 m-2 break-all w-[calc(33.33%-16px)] min-w-[280px]" 
            key={`${file.name}-${index}`}
          >
            {file.name}
            {!loading && (
              <button
                className="absolute right-2 top-2 px-4 text-marfim bg-verde-oliva-claro border-none rounded-md py-2 cursor-pointer font-medium transition-all duration-200 hover:bg-verde-oliva-escuro"
                onClick={() => removeSelectedFile(index)}
                type="button"
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>

      <ul className="flex list-none flex-wrap -mx-2 mt-2">
        {filesToSend.map((file: string, index: number) => (
          <li 
            className="relative rounded-lg bg-laranja-queimado text-marfim p-4 pr-14 pl-4 m-2 break-all w-[calc(33.33%-16px)] min-w-[280px]" 
            key={index}
          >
            {file}
            {!loading && (
              <button
                className="absolute right-2 top-2 px-4 text-marfim bg-verde-oliva-claro border-none rounded-md py-2 cursor-pointer font-medium transition-all duration-200 hover:bg-verde-oliva-escuro"
                onClick={() => removeFromSendList(file)}
                type="button"
              >
                X
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
