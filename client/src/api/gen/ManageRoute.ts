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
  ApiEntitiesCommonResponseArrayModelsProvider,
  ApiEntitiesCommonResponseBool,
  ApiEntitiesCommonResponseModelsProvider,
  ApiModelsProvider,
} from './data-contracts';

export namespace Manage {
  /**
   * @description 创建 API 提供商
   * @tags Provider
   * @name ProviderCreatePost
   * @summary 创建 API 提供商
   * @request POST:/manage/provider/create
   * @response `200` `ApiEntitiesCommonResponseModelsProvider` 成功创建的 API 提供商
   */
  export namespace ProviderCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiModelsProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseModelsProvider;
  }

  /**
   * @description 删除 API 提供商
   * @tags Provider
   * @name ProviderDeletePost
   * @summary 删除 API 提供商
   * @request POST:/manage/provider/delete/{provider_id}
   * @response `200` `ApiEntitiesCommonResponseBool` 删除成功与否
   */
  export namespace ProviderDeletePost {
    export type RequestParams = {
      /** API 提供商 ID */
      providerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseBool;
  }

  /**
   * @description 获取 API 提供商
   * @tags Provider
   * @name ProviderGet
   * @summary 获取 API 提供商
   * @request GET:/manage/provider/{provider_id}
   * @response `200` `ApiEntitiesCommonResponseModelsProvider` API 提供商
   */
  export namespace ProviderGet {
    export type RequestParams = {
      /** API 提供商 ID */
      providerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseModelsProvider;
  }

  /**
   * @description 批量获取 API 提供商
   * @tags Provider
   * @name ProviderListGet
   * @summary 批量获取 API 提供商
   * @request GET:/manage/provider/list
   * @response `200` `ApiEntitiesCommonResponseArrayModelsProvider` API 提供商列表
   */
  export namespace ProviderListGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseArrayModelsProvider;
  }

  /**
   * @description 更新 API 提供商
   * @tags Provider
   * @name ProviderUpdatePost
   * @summary 更新 API 提供商
   * @request POST:/manage/provider/update
   * @response `200` `ApiEntitiesCommonResponseBool` 更新成功与否
   */
  export namespace ProviderUpdatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiModelsProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntitiesCommonResponseBool;
  }
}
