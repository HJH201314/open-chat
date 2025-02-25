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
import type { HttpClient, RequestParams } from './http-client';
import { ContentType } from './http-client';

export class Manage<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建 API 提供商
   *
   * @tags Provider
   * @name ProviderCreateCreate
   * @summary 创建 API 提供商
   * @request POST:/manage/provider/create
   * @response `200` `ApiEntityCommonResponseModelsProvider` 成功创建的 API 提供商
   */
  providerCreateCreate = (provider: ApiModelsProvider, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseModelsProvider, any>({
      path: `/manage/provider/create`,
      method: 'POST',
      body: provider,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 删除 API 提供商
   *
   * @tags Provider
   * @name ProviderDeleteCreate
   * @summary 删除 API 提供商
   * @request POST:/manage/provider/delete/{provider_id}
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  providerDeleteCreate = (providerId: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/provider/delete/${providerId}`,
      method: 'POST',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 获取 API 提供商
   *
   * @tags Provider
   * @name ProviderDetail
   * @summary 获取 API 提供商
   * @request GET:/manage/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseModelsProvider` API 提供商
   */
  providerDetail = (providerId: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseModelsProvider, any>({
      path: `/manage/provider/${providerId}`,
      method: 'GET',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 批量获取 API 提供商
   *
   * @tags Provider
   * @name ProviderListList
   * @summary 批量获取 API 提供商
   * @request GET:/manage/provider/list
   * @response `200` `ApiEntityCommonResponseArrayModelsProvider` API 提供商列表
   */
  providerListList = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseArrayModelsProvider, any>({
      path: `/manage/provider/list`,
      method: 'GET',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 更新 API 提供商
   *
   * @tags Provider
   * @name ProviderUpdateCreate
   * @summary 更新 API 提供商
   * @request POST:/manage/provider/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  providerUpdateCreate = (provider: ApiModelsProvider, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/provider/update`,
      method: 'POST',
      body: provider,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
