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

import type { ApiSchemaBotRole } from './data-contracts';

export namespace Bot {
  /**
   * @description 创建一个新的机器人角色，包含名称、描述和引用的会话ID
   * @tags BotRole
   * @name CreatePost
   * @summary 创建机器人角色
   * @request POST:/bot/create
   * @response `200` `ApiSchemaBotRole` 成功创建的机器人角色
   */
  export namespace CreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaBotRole;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaBotRole;
  }

  /**
   * @description 删除指定ID的机器人角色
   * @tags BotRole
   * @name DeletePost
   * @summary 删除机器人角色
   * @request POST:/bot/{id}/delete
   * @response `200` `boolean` 删除成功
   */
  export namespace DeletePost {
    export type RequestParams = {
      /** 机器人角色ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = boolean;
  }

  /**
   * @description 根据ID获取指定的机器人角色信息
   * @tags BotRole
   * @name GetBot
   * @summary 获取机器人角色
   * @request GET:/bot/{id}
   * @response `200` `ApiSchemaBotRole` 机器人角色信息
   */
  export namespace GetBot {
    export type RequestParams = {
      /** 机器人角色ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaBotRole;
  }

  /**
   * @description 获取所有机器人角色的列表
   * @tags BotRole
   * @name ListGet
   * @summary 获取机器人角色列表
   * @request GET:/bot/list
   * @response `200` `(ApiSchemaBotRole)[]` 机器人角色列表
   */
  export namespace ListGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaBotRole[];
  }

  /**
   * @description 更新指定ID的机器人角色信息
   * @tags BotRole
   * @name UpdatePost
   * @summary 更新机器人角色
   * @request POST:/bot/{id}/update
   * @response `200` `ApiSchemaBotRole` 更新后的机器人角色信息
   */
  export namespace UpdatePost {
    export type RequestParams = {
      /** 机器人角色ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaBotRole;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaBotRole;
  }
}
