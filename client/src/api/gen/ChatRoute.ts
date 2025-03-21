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
  ApiChatShareSessionShareRequest,
  ApiEntityCommonResponseArraySchemaBotRole,
  ApiEntityCommonResponseArraySchemaModelCache,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaMessage,
  ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession,
  ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession,
  ApiEntityCommonResponseSchemaSession,
  ApiEntityCommonResponseSchemaUserSession,
  ApiEntityCommonResponseString,
  ApiSchemaSession,
  ApiSchemaSessionFlagInfo,
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
   * @description 获取 bot 角色配置
   * @tags config
   * @name ConfigBotsGet
   * @summary 获取 bot 角色配置
   * @request GET:/chat/config/bots
   * @response `200` `ApiEntityCommonResponseArraySchemaBotRole` OK
   */
  export namespace ConfigBotsGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseArraySchemaBotRole;
  }

  /**
   * @description 获取模型配置
   * @tags config
   * @name ConfigModelsGet
   * @summary 获取模型配置
   * @request GET:/chat/config/models
   * @response `200` `ApiEntityCommonResponseArraySchemaModelCache` OK
   */
  export namespace ConfigModelsGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseArraySchemaModelCache;
  }

  /**
   * @description 获取消息
   * @tags Message
   * @name MessageListGet
   * @summary 获取消息
   * @request GET:/chat/message/list/{session_id}
   * @response `200` `ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaMessage` 返回数据
   */
  export namespace MessageListGet {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaMessage;
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
   * @description 更新用户会话标记
   * @tags Session
   * @name SessionFlagPost
   * @summary 更新用户会话标记
   * @request POST:/chat/session/flag/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  export namespace SessionFlagPost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaSessionFlagInfo;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取会话
   * @tags Session
   * @name SessionGet
   * @summary 获取会话
   * @request GET:/chat/session/{session_id}
   * @response `200` `ApiEntityCommonResponseSchemaSession` 返回数据
   */
  export namespace SessionGet {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaSession;
  }

  /**
   * @description 获取会话列表
   * @tags Session
   * @name SessionListGet
   * @summary 获取会话列表
   * @request GET:/chat/session/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession` 返回数据
   */
  export namespace SessionListGet {
    export type RequestParams = {};
    export type RequestQuery = {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession;
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

  /**
   * @description 分享会话
   * @tags Session
   * @name SessionSharePost
   * @summary 分享会话
   * @request POST:/chat/session/share/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  export namespace SessionSharePost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiChatShareSessionShareRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 同步会话列表
   * @tags Session
   * @name SessionSyncGet
   * @summary 同步会话列表
   * @request GET:/chat/session/sync
   * @response `200` `ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession` 返回数据
   */
  export namespace SessionSyncGet {
    export type RequestParams = {};
    export type RequestQuery = {
      /** 客户端上次同步时间戳 */
      last_sync_time: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession;
  }

  /**
   * @description 更新会话
   * @tags Session
   * @name SessionUpdatePost
   * @summary 更新会话
   * @request POST:/chat/session/update/{session_id}
   * @response `200` `ApiEntityCommonResponseBool` OK
   */
  export namespace SessionUpdatePost {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaSession;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取用户会话
   * @tags Session
   * @name SessionUserGet
   * @summary 获取用户会话
   * @request GET:/chat/session/user/{session_id}
   * @response `200` `ApiEntityCommonResponseSchemaUserSession` 返回数据
   */
  export namespace SessionUserGet {
    export type RequestParams = {
      /** 会话 ID */
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaUserSession;
  }
}
