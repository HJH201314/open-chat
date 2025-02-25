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
  ApiEntityCommonResponseArrayModelsProvider,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseModelsProvider,
  ApiModelsProvider,
} from './data-contracts';

export namespace Manage {
  /**
   * @description 创建 API 提供商
   * @tags Provider
   * @name ProviderCreateCreate
   * @summary 创建 API 提供商
   * @request POST:/manage/provider/create
   * @response `200` `ApiEntityCommonResponseModelsProvider` 成功创建的 API 提供商
   */
  export namespace ProviderCreateCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiModelsProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseModelsProvider;
  }

  /**
   * @description 删除 API 提供商
   * @tags Provider
   * @name ProviderDeleteCreate
   * @summary 删除 API 提供商
   * @request POST:/manage/provider/delete/{provider_id}
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace ProviderDeleteCreate {
    export type RequestParams = {
      /** API 提供商 ID */
      providerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取 API 提供商
   * @tags Provider
   * @name ProviderDetail
   * @summary 获取 API 提供商
   * @request GET:/manage/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseModelsProvider` API 提供商
   */
  export namespace ProviderDetail {
    export type RequestParams = {
      /** API 提供商 ID */
      providerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseModelsProvider;
  }

  /**
   * @description 批量获取 API 提供商
   * @tags Provider
   * @name ProviderListList
   * @summary 批量获取 API 提供商
   * @request GET:/manage/provider/list
   * @response `200` `ApiEntityCommonResponseArrayModelsProvider` API 提供商列表
   */
  export namespace ProviderListList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseArrayModelsProvider;
  }

  /**
   * @description 更新 API 提供商
   * @tags Provider
   * @name ProviderUpdateCreate
   * @summary 更新 API 提供商
   * @request POST:/manage/provider/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace ProviderUpdateCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiModelsProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }
}
