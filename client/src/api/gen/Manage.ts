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

import type {
  ApiEntityCommonResponseArraySchemaProvider,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser,
  ApiEntityCommonResponseInt,
  ApiEntityCommonResponseSchemaAPIKey,
  ApiEntityCommonResponseSchemaBucket,
  ApiEntityCommonResponseSchemaModel,
  ApiEntityCommonResponseSchemaModelCollection,
  ApiEntityCommonResponseSchemaPermission,
  ApiEntityCommonResponseSchemaProvider,
  ApiEntityCommonResponseSchemaRole,
  ApiEntityCommonResponseSchemaUser,
  ApiEntityReqUpdateBodySchemaBucket,
  ApiEntityReqUpdateBodySchemaModelCollection,
  ApiEntityReqUpdateBodySchemaRole,
  ApiSchemaAPIKey,
  ApiSchemaBucket,
  ApiSchemaModel,
  ApiSchemaModelCollection,
  ApiSchemaPermission,
  ApiSchemaProvider,
  ApiSchemaRole,
  ApiSchemaUser,
} from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class Manage<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建 储存桶
   *
   * @tags Bucket
   * @name BucketCreatePost
   * @summary 创建 储存桶
   * @request POST:/manage/bucket/create
   * @response `200` `ApiEntityCommonResponseSchemaBucket` 成功创建的 储存桶
   */
  bucketCreatePost = (bucket: ApiSchemaBucket, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaBucket, any>({
      path: `/manage/bucket/create`,
      method: "POST",
      body: bucket,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除 储存桶
   *
   * @tags Bucket
   * @name BucketDeletePost
   * @summary 删除 储存桶
   * @request POST:/manage/bucket/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  bucketDeletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/bucket/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取 储存桶
   *
   * @tags Bucket
   * @name BucketGet
   * @summary 获取 储存桶
   * @request GET:/manage/bucket/{id}
   * @response `200` `ApiEntityCommonResponseSchemaBucket` 储存桶
   */
  bucketGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaBucket, any>({
      path: `/manage/bucket/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量获取 储存桶
   *
   * @tags Bucket
   * @name BucketListGet
   * @summary 批量获取 储存桶
   * @request GET:/manage/bucket/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket` 储存桶列表
   */
  bucketListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket, any>({
      path: `/manage/bucket/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新 储存桶
   *
   * @tags Bucket
   * @name BucketUpdatePost
   * @summary 更新 储存桶
   * @request POST:/manage/bucket/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  bucketUpdatePost = (id: number, bucket: ApiEntityReqUpdateBodySchemaBucket, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/bucket/${id}/update`,
      method: "POST",
      body: bucket,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建模型集合
   *
   * @tags ModelCollection
   * @name CollectionCreatePost
   * @summary 创建模型集合
   * @request POST:/manage/collection/create
   * @response `200` `ApiEntityCommonResponseSchemaModelCollection` 成功创建的模型集合
   */
  collectionCreatePost = (model: ApiSchemaModelCollection, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaModelCollection, any>({
      path: `/manage/collection/create`,
      method: "POST",
      body: model,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除模型集合
   *
   * @tags Model
   * @name CollectionDeletePost
   * @summary 删除模型集合
   * @request POST:/manage/collection/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  collectionDeletePost = (collectionId: number, id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/collection/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取模型集合
   *
   * @tags ModelCollection
   * @name CollectionGet
   * @summary 获取模型集合
   * @request GET:/manage/collection/{id}
   * @response `200` `ApiEntityCommonResponseSchemaModelCollection` 模型
   */
  collectionGet = (collectionId: number, id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaModelCollection, any>({
      path: `/manage/collection/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量获取模型集合
   *
   * @tags ModelCollection
   * @name CollectionListGet
   * @summary 批量获取模型集合
   * @request GET:/manage/collection/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection` 模型集合列表
   */
  collectionListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection, any>({
      path: `/manage/collection/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新模型集合
   *
   * @tags ModelCollection
   * @name CollectionUpdatePost
   * @summary 更新模型集合
   * @request POST:/manage/collection/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 成功更新与否
   */
  collectionUpdatePost = (id: number, model: ApiEntityReqUpdateBodySchemaModelCollection, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/collection/${id}/update`,
      method: "POST",
      body: model,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建 APIKey 并绑定 到 API 提供商
   *
   * @tags APIKey
   * @name KeyCreatePost
   * @summary 创建 APIKey
   * @request POST:/manage/key/create
   * @response `200` `ApiEntityCommonResponseSchemaAPIKey` 成功创建的 API Key
   */
  keyCreatePost = (apikey: ApiSchemaAPIKey, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaAPIKey, any>({
      path: `/manage/key/create`,
      method: "POST",
      body: apikey,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除 APIKey
   *
   * @tags APIKey
   * @name KeyDeletePost
   * @summary 删除 APIKey
   * @request POST:/manage/key/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  keyDeletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/key/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 列出供应商的 APIKey
   *
   * @tags APIKey
   * @name KeyListProviderGet
   * @summary 列出APIKey
   * @request GET:/manage/key/list/provider/{id}
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey` 成功创建的 API Key
   */
  keyListProviderGet = (
    id: number,
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey, any>({
      path: `/manage/key/list/provider/${id}`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建模型并绑定到 API 供应商
   *
   * @tags Model
   * @name ModelCreatePost
   * @summary 创建模型
   * @request POST:/manage/model/create
   * @response `200` `ApiEntityCommonResponseSchemaModel` 成功创建的模型
   */
  modelCreatePost = (model: ApiSchemaModel, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaModel, any>({
      path: `/manage/model/create`,
      method: "POST",
      body: model,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除模型
   *
   * @tags Model
   * @name ModelDeletePost
   * @summary 删除模型
   * @request POST:/manage/model/delete/{model_id}
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  modelDeletePost = (modelId: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/model/delete/${modelId}`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取模型
   *
   * @tags Model
   * @name ModelGet
   * @summary 获取模型
   * @request GET:/manage/model/{model_id}
   * @response `200` `ApiEntityCommonResponseSchemaModel` 模型
   */
  modelGet = (modelId: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaModel, any>({
      path: `/manage/model/${modelId}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量获取模型
   *
   * @tags Model
   * @name ModelListGet
   * @summary 批量获取模型
   * @request GET:/manage/model/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel` 模型列表
   */
  modelListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel, any>({
      path: `/manage/model/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取 API 提供商的模型
   *
   * @tags Model
   * @name ModelProviderGet
   * @summary 获取 API 提供商的模型
   * @request GET:/manage/model/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel` 模型列表
   */
  modelProviderGet = (
    providerId: number,
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel, any>({
      path: `/manage/model/provider/${providerId}`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新所有模型缓存，生产环境高危操作
   *
   * @tags Model
   * @name ModelRefreshPost
   * @summary manageModelGroup
   * @request POST:/manage/model/refresh
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  modelRefreshPost = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/model/refresh`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update 更新模型，若参数不传入或为空，则不会更新
   *
   * @tags Model
   * @name ModelUpdatePost
   * @summary 更新模型
   * @request POST:/manage/model/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  modelUpdatePost = (model: ApiSchemaModel, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/model/update`,
      method: "POST",
      body: model,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取权限
   *
   * @tags Permission
   * @name PermissionGet
   * @summary 获取权限
   * @request GET:/manage/permission/{id}
   * @response `200` `ApiEntityCommonResponseSchemaPermission` 权限
   */
  permissionGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaPermission, any>({
      path: `/manage/permission/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量分页获取权限
   *
   * @tags Permission
   * @name PermissionListGet
   * @summary 批量分页获取权限
   * @request GET:/manage/permission/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission` 权限列表
   */
  permissionListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission, any>({
      path: `/manage/permission/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新权限
   *
   * @tags Permission
   * @name PermissionUpdatePost
   * @summary 更新权限
   * @request POST:/manage/permission/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  permissionUpdatePost = (id: number, permission: ApiSchemaPermission, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/permission/${id}/update`,
      method: "POST",
      body: permission,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取所有 API 提供商
   *
   * @tags Provider
   * @name ProviderAllGet
   * @summary 获取所有 API 提供商
   * @request GET:/manage/provider/all
   * @response `200` `ApiEntityCommonResponseArraySchemaProvider` API 提供商列表
   */
  providerAllGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseArraySchemaProvider, any>({
      path: `/manage/provider/all`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建 API 提供商
   *
   * @tags Provider
   * @name ProviderCreatePost
   * @summary 创建 API 提供商
   * @request POST:/manage/provider/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的 API 提供商
   */
  providerCreatePost = (provider: ApiSchemaProvider, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProvider, any>({
      path: `/manage/provider/create`,
      method: "POST",
      body: provider,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除 API 提供商
   *
   * @tags Provider
   * @name ProviderDeletePost
   * @summary 删除 API 提供商
   * @request POST:/manage/provider/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  providerDeletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/provider/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取 API 提供商
   *
   * @tags Provider
   * @name ProviderGet
   * @summary 获取 API 提供商
   * @request GET:/manage/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseSchemaProvider` API 提供商
   */
  providerGet = (providerId: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProvider, any>({
      path: `/manage/provider/${providerId}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量获取 API 提供商
   *
   * @tags Provider
   * @name ProviderListGet
   * @summary 批量获取 API 提供商
   * @request GET:/manage/provider/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider` API 提供商列表
   */
  providerListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider, any>({
      path: `/manage/provider/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新 API 提供商
   *
   * @tags Provider
   * @name ProviderUpdatePost
   * @summary 更新 API 提供商
   * @request POST:/manage/provider/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  providerUpdatePost = (id: number, provider: ApiSchemaProvider, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/provider/${id}/update`,
      method: "POST",
      body: provider,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建角色
   *
   * @tags Role
   * @name RoleCreatePost
   * @summary 创建角色
   * @request POST:/manage/role/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的角色
   */
  roleCreatePost = (role: ApiSchemaRole, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProvider, any>({
      path: `/manage/role/create`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除角色
   *
   * @tags Role
   * @name RoleDeletePost
   * @summary 删除角色
   * @request POST:/manage/role/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  roleDeletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/role/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取角色
   *
   * @tags Role
   * @name RoleGet
   * @summary 获取角色
   * @request GET:/manage/role/{id}
   * @response `200` `ApiEntityCommonResponseSchemaRole` 角色
   */
  roleGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaRole, any>({
      path: `/manage/role/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量分页获取角色
   *
   * @tags Role
   * @name RoleListGet
   * @summary 批量分页获取角色
   * @request GET:/manage/role/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole` 角色列表
   */
  roleListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole, any>({
      path: `/manage/role/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新角色
   *
   * @tags Role
   * @name RoleUpdatePost
   * @summary 更新角色
   * @request POST:/manage/role/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  roleUpdatePost = (id: number, role: ApiEntityReqUpdateBodySchemaRole, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/role/${id}/update`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 创建用户
   *
   * @tags User
   * @name UserCreatePost
   * @summary 创建用户
   * @request POST:/manage/user/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的用户
   */
  userCreatePost = (user: ApiSchemaUser, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProvider, any>({
      path: `/manage/user/create`,
      method: "POST",
      body: user,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除用户
   *
   * @tags User
   * @name UserDeletePost
   * @summary 删除用户
   * @request POST:/manage/user/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  userDeletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/user/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取用户
   *
   * @tags User
   * @name UserGet
   * @summary 获取用户
   * @request GET:/manage/user/{id}
   * @response `200` `ApiEntityCommonResponseSchemaUser` 用户
   */
  userGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, any>({
      path: `/manage/user/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 批量分页获取用户
   *
   * @tags User
   * @name UserListGet
   * @summary 批量分页获取用户
   * @request GET:/manage/user/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser` 用户列表
   */
  userListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser, any>({
      path: `/manage/user/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 强制登出用户
   *
   * @tags User
   * @name UserLogoutPost
   * @summary 强制登出用户
   * @request POST:/manage/user/{id}/logout
   * @response `200` `ApiEntityCommonResponseInt` 成功登出的设备数量
   */
  userLogoutPost = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseInt, any>({
      path: `/manage/user/${id}/logout`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新用户
   *
   * @tags User
   * @name UserUpdatePost
   * @summary 更新用户
   * @request POST:/manage/user/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  userUpdatePost = (id: number, user: ApiSchemaUser, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/manage/user/${id}/update`,
      method: "POST",
      body: user,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
