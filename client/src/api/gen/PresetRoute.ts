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

import type { ApiSchemaPreset } from "./data-contracts";

export namespace Preset {
  /**
   * @description 创建一个新的预设，包含名称、描述和引用的会话ID
   * @tags Preset
   * @name CreatePost
   * @summary 创建预设
   * @request POST:/preset/create
   * @response `200` `ApiSchemaPreset` 成功创建的预设
   */
  export namespace CreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaPreset;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaPreset;
  }

  /**
   * @description 删除指定ID的预设
   * @tags Preset
   * @name DeletePost
   * @summary 删除预设
   * @request POST:/preset/{id}/delete
   * @response `200` `boolean` 删除成功
   */
  export namespace DeletePost {
    export type RequestParams = {
      /** 预设ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = boolean;
  }

  /**
   * @description 获取所有预设的列表
   * @tags Preset
   * @name ListGet
   * @summary 获取预设列表
   * @request GET:/preset/list
   * @response `200` `(ApiSchemaPreset)[]` 预设列表
   */
  export namespace ListGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaPreset[];
  }

  /**
   * @description 根据ID获取指定的预设信息
   * @tags Preset
   * @name PresetGet
   * @summary 获取预设
   * @request GET:/preset/{id}
   * @response `200` `ApiSchemaPreset` 预设信息
   */
  export namespace PresetGet {
    export type RequestParams = {
      /** 预设ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaPreset;
  }

  /**
   * @description 更新指定ID的预设信息
   * @tags Preset
   * @name UpdatePost
   * @summary 更新预设
   * @request POST:/preset/{id}/update
   * @response `200` `ApiSchemaPreset` 更新后的预设信息
   */
  export namespace UpdatePost {
    export type RequestParams = {
      /** 预设ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaPreset;
    export type RequestHeaders = {};
    export type ResponseBody = ApiSchemaPreset;
  }
}
