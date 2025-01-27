import { createRequest } from '@/api/base';
import { type EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { SERVER_NEXT_API_URL } from '@/constants';

/* 创建对话，返回一个 session_id 作为对话的唯一标识 */
export const createSession = () => createRequest<
  API.CommonStringResponse
>("/chat/session/new", {
  method: "GET",
});

/* 删除对话，成功返回 true */
export const deleteSession = (sessionId: string) => createRequest<
  API.CommonBooleanResponse
>(`/chat/session/del/${sessionId}`, {
  method: "POST",
});

export const completionStream = async (
  sessionId: string,
  msg: string,
  withContext: boolean,
  signal: AbortSignal,
  onMessage: (e: EventSourceMessage) => void,
) => {
  return await fetchEventSource(`${SERVER_NEXT_API_URL}/chat/completion/stream/${sessionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      enable_context: withContext,
      question: msg,
    }),
    signal: signal,
    async onopen(response) {
      if (response.ok && response.headers.get('Content-Type') === EventStreamContentType) {
        return;
      }
    },
    // 接收流式消息
    onmessage: onMessage,
  });
}