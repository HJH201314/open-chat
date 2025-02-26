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

export namespace Chat {
  /**
   * @description 流式输出聊天
   * @tags Chat
   * @name CompletionStreamPost
   * @summary 流式输出聊天
   * @request POST:/chat/completion/stream/{session_id}
   */
  export namespace CompletionStreamPost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiChatCompletionStreamUserInput;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * @description 获取所有模型
   * @tags config
   * @name ConfigModelsGet
   * @summary 获取所有模型
   * @request GET:/chat/config/models
   * @response `200` `ApiEntityCommonResponseArrayModelsModelCache` OK
   */
  export namespace ConfigModelsGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseArrayModelsModelCache;
  }

  /**
   * @description 删除会话
   * @tags Session
   * @name SessionDelPost
   * @summary 删除会话
   * @request POST:/chat/session/del/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  export namespace SessionDelPost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 创建会话
   * @tags Session
   * @name SessionNewPost
   * @summary 创建会话
   * @request POST:/chat/session/new
   * @response `200` `ApiEntityCommonResponseString` OK
   */
  export namespace SessionNewPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseString;
  }
}
