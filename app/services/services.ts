const url = "https://tarsila.audiofusion.com.br";
const uploadUrl = "http://154.53.63.54:8250";
const headers = { "Content-Type": "application/json" };

export enum MSG_TYPES {
  AI_TEXT = "ai_message",
  USER_TEXT = "user_message",
}

export type Message = {
  msg_type: MSG_TYPES;
  message: string;
  timestamp: string;
};

export type ChatId = string | null;

export type ChatType = {
  chat_id: ChatId;
  title: string | null;
}

export interface RequestError {
  errorMsg: string;
}

export interface Conversation {
  history: Message[];
  draft: string;
}

export interface PastChats {
  chats: ChatType[],
  next_cursor: number
}

export async function startChat(
  user: string,
  chat_id: ChatId,
): Promise<Conversation | RequestError> {
  const path = "/v1/start-chat";
  const body = JSON.stringify({
    user,
    chat_id,
  });

  try {
    const resp = await fetch(url + path, { method: "POST", headers, body });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data: Conversation = (await resp.json()) as Conversation;

    // verifica se dados obrigatorios foram retornados

    // if (!data.chat_id) {
    //   throw new Error("Missing chatId.");
    // } else if (!data.greetings) {
    //   throw new Error("Missing greetings.");
    // }

    return data;
  } catch (error) {
    console.error(error);
    return { errorMsg: error } as RequestError;
  }
}

export async function getPastChats(
  user: string | ""
): Promise<PastChats| RequestError> {
  const path = "/v1/past-chats?";
  const params = new URLSearchParams({ cursor: '0', count: '5', user: user });
  const body = JSON.stringify({ user });

  try {
    const resp = await fetch(url + path + params, { method: "POST", headers, body });
    if (!resp.ok) {
      // throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data: PastChats = (await resp.json()) as PastChats;

    return data;
  } catch (error) {
    console.error(error);
    return { errorMsg: error } as RequestError;
  }
}

export async function sendMessage(
  user: string | "",
  chat_id: ChatId,
  message: string,
  file_ids: Array<string>
): Promise<Conversation | RequestError> {
  const path = "/v1/chat/text";
  const body = JSON.stringify({
    user,
    chat_id,
    message,
    file_ids,
  });

  try {
    const resp = await fetch(url + path, { method: "POST", headers, body });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = (await resp.json()) as Conversation;

    // verifica se dados obrigatorios foram retornados

    // if (!data.ai_message) {
    //   throw new Error("Missing ai_message.");
    // }

    return data;
  } catch (error) {
    console.error(error);
    return { errorMsg: error } as RequestError;
  }
}

export async function addFile(
  user: string | "",
  chat_id: ChatId,
  files: Array<File>
): Promise<Array<string> | RequestError> {
  const path = "/v1/upload";

  const body = new FormData();
  body.append("user_email", user);

  const chatIdNumber = chat_id ? Number(chat_id) : null;
  if (chatIdNumber === null || Number.isNaN(chatIdNumber)) {
    throw new Error("Invalid chat_id (expected a number).");
  }
  body.append("chat_id", String(chatIdNumber));

  files.forEach((file) => {
    body.append("docs", file);
  });

  try {
    const resp = await fetch(uploadUrl + path, {
      method: "POST",
      headers: {},
      body,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Upload failed (${resp.status}): ${text || resp.statusText}`);
    }

    const data = (await resp.json()) as Array<string>;

    return data;
  } catch (error) {
    console.error(error);
    return { errorMsg: error } as RequestError;
  }
}

export async function convertToPdf(
  html: string
): Promise<Blob | RequestError> {
  const path = "/v1/convert-to-pdf";
  const body = JSON.stringify({ html });

  try {
    const resp = await fetch(url + path, { method: "POST", headers, body });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    };
    const data = (await resp.blob());

    // verifica se dados obrigatorios foram retornados

    // if (!data.ai_message) {
    //   throw new Error("Missing ai_message.");
    // }

    return data;
  } catch (error) {
    console.error(error);
    return { errorMsg: error } as RequestError;
  };
};
