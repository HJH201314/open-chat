import { createRequest, errorHandler, successHandler } from '@/api/base';
import { SERVER_NEXT_API_URL, USER_ACCESS_TOKEN_KEY } from '@/constants';
import { type EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';

/* 创建对话，返回一个 session_id 作为对话的唯一标识 */
export const createSession = () =>
  createRequest<API.CommonStringResponse>('/chat/session/new', {
    method: 'POST',
  });

/* 删除对话，成功返回 true */
export const deleteSession = (sessionId: string) =>
  createRequest<API.CommonBooleanResponse>(`/chat/session/del/${sessionId}`, {
    method: 'POST',
  });

/**
 * 流式输出聊天
 * @param options
 * @param signal
 * @param onMessage
 * @throws err 流式传输中途出问题时抛出异常
 */
export const completionStream = (
  options: API.ChatCompletionOption,
  signal: AbortSignal,
  onMessage: (e: EventSourceMessage) => void
) => {
  const { sessionId, withContext, msg, provider, modelName, systemPrompt } = options;
  return fetchEventSource(`${SERVER_NEXT_API_URL}/chat/completion/stream/${sessionId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enable_context: withContext,
      system_prompt: systemPrompt,
      provider_name: provider,
      model_name: modelName,
      question: msg,
    }),
    signal: signal,
    openWhenHidden: true, // 页面隐藏时不中断
    async onopen(response) {
      if (response.ok && response.headers.get('Content-Type') === EventStreamContentType) {
        successHandler(response);
        return;
      } else {
        errorHandler(response);
      }
    },
    onerror(err) {
      throw err;
    },
    // 接收流式消息
    onmessage: onMessage,
  });
};
