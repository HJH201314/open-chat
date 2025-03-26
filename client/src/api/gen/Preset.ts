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
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class Preset<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建一个新的预设，包含名称、描述和引用的会话ID
   *
   * @tags Preset
   * @name CreatePost
   * @summary 创建预设
   * @request POST:/preset/create
   * @response `200` `ApiSchemaPreset` 成功创建的预设
   */
  createPost = (role: ApiSchemaPreset, params: RequestParams = {}) =>
    this.http.request<ApiSchemaPreset, any>({
      path: `/preset/create`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除指定ID的预设
   *
   * @tags Preset
   * @name DeletePost
   * @summary 删除预设
   * @request POST:/preset/{id}/delete
   * @response `200` `boolean` 删除成功
   */
  deletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<boolean, any>({
      path: `/preset/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取所有预设的列表
   *
   * @tags Preset
   * @name ListGet
   * @summary 获取预设列表
   * @request GET:/preset/list
   * @response `200` `(ApiSchemaPreset)[]` 预设列表
   */
  listGet = (params: RequestParams = {}) =>
    this.http.request<ApiSchemaPreset[], any>({
      path: `/preset/list`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 根据ID获取指定的预设信息
   *
   * @tags Preset
   * @name PresetGet
   * @summary 获取预设
   * @request GET:/preset/{id}
   * @response `200` `ApiSchemaPreset` 预设信息
   */
  presetGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiSchemaPreset, any>({
      path: `/preset/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新指定ID的预设信息
   *
   * @tags Preset
   * @name UpdatePost
   * @summary 更新预设
   * @request POST:/preset/{id}/update
   * @response `200` `ApiSchemaPreset` 更新后的预设信息
   */
  updatePost = (id: number, role: ApiSchemaPreset, params: RequestParams = {}) =>
    this.http.request<ApiSchemaPreset, any>({
      path: `/preset/${id}/update`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
