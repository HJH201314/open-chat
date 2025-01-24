/* 获取session_id作为一个对话的唯一标识 */
import { createRequest } from '@/api/base';
import { type EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { SERVER_NEXT_API_URL } from '@/constants';

export const getNewSession = () => createRequest<
  API.CommonStringResponse
>("/chat/session/new", {
  method: "GET",
});

export const completionStream = async (
  sessionId: string,
  msg: string,
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