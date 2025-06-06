/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  ApiChatCompletionStreamUserInput,
  ApiChatShareSessionShareRequest,
  ApiEntityCommonResponseArrayEntityConfigChatModel,
  ApiEntityCommonResponseArraySchemaPreset,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseChatChatMessageListResponse,
  ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession,
  ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession,
  ApiEntityCommonResponseSchemaMessage,
  ApiEntityCommonResponseSchemaSession,
  ApiEntityCommonResponseSchemaUserSession,
  ApiEntityCommonResponseString,
  ApiEntityReqUpdateBodySchemaSession,
  ApiSchemaMessage,
  ApiSchemaSessionFlagInfo,
} from './data-contracts';
import type { HttpClient, RequestParams } from './http-client';
import { ContentType } from './http-client';

export class Chat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 流式输出聊天
   *
   * @tags Chat
   * @name CompletionStreamPost
   * @summary 流式输出聊天
   * @request POST:/chat/completion/stream/{session_id}
   */
  completionStreamPost = (sessionId: string, request: ApiChatCompletionStreamUserInput, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/chat/completion/stream/${sessionId}`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取 bot 角色配置
   *
   * @tags config
   * @name ConfigBotsGet
   * @summary 获取 bot 角色配置
   * @request GET:/chat/config/bots
   * @response `200` `ApiEntityCommonResponseArraySchemaPreset` OK
   */
  configBotsGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseArraySchemaPreset, any>({
      path: `/chat/config/bots`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取模型配置
   *
   * @tags config
   * @name ConfigModelsGet
   * @summary 获取模型配置
   * @request GET:/chat/config/models
   * @response `200` `ApiEntityCommonResponseArrayEntityConfigChatModel` OK
   */
  configModelsGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseArrayEntityConfigChatModel, any>({
      path: `/chat/config/models`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取消息
   *
   * @tags Message
   * @name MessageListGet
   * @summary 获取消息
   * @request GET:/chat/message/list/{session_id}
   * @response `200` `ApiEntityCommonResponseChatChatMessageListResponse` 返回数据
   */
  messageListGet = (
    sessionId: string,
    query?: {
      end_time?: number;
      /** 分页参数 */
      page_num?: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseChatChatMessageListResponse, any>({
      path: `/chat/message/list/${sessionId}`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取分享过的消息
   *
   * @tags Message
   * @name MessageListSharedGet
   * @summary 获取分享过的消息
   * @request GET:/chat/message/list/{session_id}/shared
   * @response `200` `ApiEntityCommonResponseChatChatMessageListResponse` 返回数据
   */
  messageListSharedGet = (
    sessionId: string,
    query?: {
      code?: string;
      end_time?: number;
      /** 分页参数 */
      page_num?: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseChatChatMessageListResponse, any>({
      path: `/chat/message/list/${sessionId}/shared`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新消息（仅 extra 字段的增量合并更新）
   *
   * @tags Message
   * @name MessageUpdatePost
   * @summary 更新消息
   * @request POST:/chat/message/{id}/update
   * @response `200` `ApiEntityCommonResponseSchemaMessage` 返回数据
   */
  messageUpdatePost = (id: string, req: ApiSchemaMessage, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaMessage, any>({
      path: `/chat/message/${id}/update`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除会话
   *
   * @tags Session
   * @name SessionDelPost
   * @summary 删除会话
   * @request POST:/chat/session/del/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  sessionDelPost = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/chat/session/del/${sessionId}`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新用户会话标记
   *
   * @tags Session
   * @name SessionFlagPost
   * @summary 更新用户会话标记
   * @request POST:/chat/session/flag/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  sessionFlagPost = (sessionId: string, req: ApiSchemaSessionFlagInfo, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/chat/session/flag/${sessionId}`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取会话
   *
   * @tags Session
   * @name SessionGet
   * @summary 获取会话
   * @request GET:/chat/session/{session_id}
   * @response `200` `ApiEntityCommonResponseSchemaSession` 返回数据
   */
  sessionGet = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaSession, any>({
      path: `/chat/session/${sessionId}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取会话列表
   *
   * @tags Session
   * @name SessionListGet
   * @summary 获取会话列表
   * @request GET:/chat/session/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession` 返回数据
   */
  sessionListGet = (
    query?: {
      end_time?: number;
      /** 分页参数 */
      page_num?: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession, any>({
      path: `/chat/session/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建会话
   *
   * @tags Session
   * @name SessionNewPost
   * @summary 创建会话
   * @request POST:/chat/session/new
   * @response `200` `ApiEntityCommonResponseString` OK
   */
  sessionNewPost = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseString, any>({
      path: `/chat/session/new`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取已分享的用户会话信息（仅返回 Name）
   *
   * @tags Session
   * @name SessionSharedGet
   * @summary 获取已分享的用户会话信息
   * @request GET:/chat/session/{session_id}/shared
   * @response `200` `ApiEntityCommonResponseSchemaUserSession` 返回数据
   */
  sessionSharedGet = (
    sessionId: string,
    query?: {
      code?: string;
      /** 尝试获取而不抛出错误 */
      touch?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseSchemaUserSession, any>({
      path: `/chat/session/${sessionId}/shared`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 分享会话
   *
   * @tags Session
   * @name SessionSharePost
   * @summary 分享会话
   * @request POST:/chat/session/share/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  sessionSharePost = (sessionId: string, req: ApiChatShareSessionShareRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/chat/session/share/${sessionId}`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 同步会话列表
   *
   * @tags Session
   * @name SessionSyncGet
   * @summary 同步会话列表
   * @request GET:/chat/session/sync
   * @response `200` `ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession` 返回数据
   */
  sessionSyncGet = (
    query: {
      end_time?: number;
      /** 客户端上次同步时间戳 */
      last_sync_time: number;
      /** 分页参数 */
      page_num?: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession, any>({
      path: `/chat/session/sync`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新会话
   *
   * @tags Session
   * @name SessionUpdatePost
   * @summary 更新会话
   * @request POST:/chat/session/update/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  sessionUpdatePost = (sessionId: string, req: ApiEntityReqUpdateBodySchemaSession, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/chat/session/update/${sessionId}`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取用户会话
   *
   * @tags Session
   * @name SessionUserGet
   * @summary 获取用户会话
   * @request GET:/chat/session/user/{session_id}
   * @response `200` `ApiEntityCommonResponseSchemaUserSession` 返回数据
   */
  sessionUserGet = (sessionId: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUserSession, any>({
      path: `/chat/session/user/${sessionId}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
