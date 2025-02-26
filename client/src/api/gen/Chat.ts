/* eslint-disable */
/* tslint:disable */
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
  ApiEntityCommonResponseArrayModelsModelCache,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseString,
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
      method: 'POST',
      body: request,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 获取所有模型
   *
   * @tags config
   * @name ConfigModelsGet
   * @summary 获取所有模型
   * @request GET:/chat/config/models
   * @response `200` `ApiEntityCommonResponseArrayModelsModelCache` OK
   */
  configModelsGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseArrayModelsModelCache, any>({
      path: `/chat/config/models`,
      method: 'GET',
      type: ContentType.Json,
      format: 'json',
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
      method: 'POST',
      type: ContentType.Json,
      format: 'json',
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
      method: 'POST',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
