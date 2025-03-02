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
  ApiEntitiesCommonResponseArrayModelsModelCache,
  ApiEntitiesCommonResponseBool,
  ApiEntitiesCommonResponseChatGetMessagesResType,
  ApiEntitiesCommonResponseString,
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
   * @response `200` `ApiEntitiesCommonResponseArrayModelsModelCache` OK
   */
  export namespace ConfigModelsGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseArrayModelsModelCache;
  }

  /**
   * @description 获取消息
   * @tags Message
   * @name MessageListGet
   * @summary 获取消息
   * @request GET:/chat/message/list/{session_id}
   * @response `200` `ApiEntitiesCommonResponseChatGetMessagesResType` 返回数据
   */
  export namespace MessageListGet {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {
      page_num: number;
      page_size?: number;
      sort_expr?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseChatGetMessagesResType;
  }

  /**
   * @description 删除会话
   * @tags Session
   * @name SessionDelPost
   * @summary 删除会话
   * @request POST:/chat/session/del/{session_id}
   * @response `200` `ApiEntitiesCommonResponseBool` OK
   */
  export namespace SessionDelPost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseBool;
  }

  /**
   * @description 创建会话
   * @tags Session
   * @name SessionNewPost
   * @summary 创建会话
   * @request POST:/chat/session/new
   * @response `200` `ApiEntitiesCommonResponseString` OK
   */
  export namespace SessionNewPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseString;
  }
}
