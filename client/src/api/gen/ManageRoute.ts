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

export namespace Manage {
  /**
   * @description 创建 储存桶
   * @tags Bucket
   * @name BucketCreatePost
   * @summary 创建 储存桶
   * @request POST:/manage/bucket/create
   * @response `200` `ApiEntityCommonResponseSchemaBucket` 成功创建的 储存桶
   */
  export namespace BucketCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaBucket;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaBucket;
  }

  /**
   * @description 删除 储存桶
   * @tags Bucket
   * @name BucketDeletePost
   * @summary 删除 储存桶
   * @request POST:/manage/bucket/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace BucketDeletePost {
    export type RequestParams = {
      /** 储存桶 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取 储存桶
   * @tags Bucket
   * @name BucketGet
   * @summary 获取 储存桶
   * @request GET:/manage/bucket/{id}
   * @response `200` `ApiEntityCommonResponseSchemaBucket` 储存桶
   */
  export namespace BucketGet {
    export type RequestParams = {
      /** 储存桶 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaBucket;
  }

  /**
   * @description 批量获取 储存桶
   * @tags Bucket
   * @name BucketListGet
   * @summary 批量获取 储存桶
   * @request GET:/manage/bucket/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket` 储存桶列表
   */
  export namespace BucketListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket;
  }

  /**
   * @description 更新 储存桶
   * @tags Bucket
   * @name BucketUpdatePost
   * @summary 更新 储存桶
   * @request POST:/manage/bucket/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace BucketUpdatePost {
    export type RequestParams = {
      /** 储存桶 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiEntityReqUpdateBodySchemaBucket;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 创建模型集合
   * @tags ModelCollection
   * @name CollectionCreatePost
   * @summary 创建模型集合
   * @request POST:/manage/collection/create
   * @response `200` `ApiEntityCommonResponseSchemaModelCollection` 成功创建的模型集合
   */
  export namespace CollectionCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaModelCollection;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaModelCollection;
  }

  /**
   * @description 删除模型集合
   * @tags Model
   * @name CollectionDeletePost
   * @summary 删除模型集合
   * @request POST:/manage/collection/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace CollectionDeletePost {
    export type RequestParams = {
      /** ModelCollection ID */
      collectionId: number;
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取模型集合
   * @tags ModelCollection
   * @name CollectionGet
   * @summary 获取模型集合
   * @request GET:/manage/collection/{id}
   * @response `200` `ApiEntityCommonResponseSchemaModelCollection` 模型
   */
  export namespace CollectionGet {
    export type RequestParams = {
      /** ModelCollection ID */
      collectionId: number;
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaModelCollection;
  }

  /**
   * @description 批量获取模型集合
   * @tags ModelCollection
   * @name CollectionListGet
   * @summary 批量获取模型集合
   * @request GET:/manage/collection/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection` 模型集合列表
   */
  export namespace CollectionListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection;
  }

  /**
   * @description 更新模型集合
   * @tags ModelCollection
   * @name CollectionUpdatePost
   * @summary 更新模型集合
   * @request POST:/manage/collection/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 成功更新与否
   */
  export namespace CollectionUpdatePost {
    export type RequestParams = {
      /** 模型集合 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiEntityReqUpdateBodySchemaModelCollection;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 创建 APIKey 并绑定 到 API 提供商
   * @tags APIKey
   * @name KeyCreatePost
   * @summary 创建 APIKey
   * @request POST:/manage/key/create
   * @response `200` `ApiEntityCommonResponseSchemaAPIKey` 成功创建的 API Key
   */
  export namespace KeyCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaAPIKey;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaAPIKey;
  }

  /**
   * @description 删除 APIKey
   * @tags APIKey
   * @name KeyDeletePost
   * @summary 删除 APIKey
   * @request POST:/manage/key/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace KeyDeletePost {
    export type RequestParams = {
      /** API Key ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 列出供应商的 APIKey
   * @tags APIKey
   * @name KeyListProviderGet
   * @summary 列出APIKey
   * @request GET:/manage/key/list/provider/{id}
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey` 成功创建的 API Key
   */
  export namespace KeyListProviderGet {
    export type RequestParams = {
      /** API 提供商 ID */
      id: number;
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey;
  }

  /**
   * @description 创建模型并绑定到 API 供应商
   * @tags Model
   * @name ModelCreatePost
   * @summary 创建模型
   * @request POST:/manage/model/create
   * @response `200` `ApiEntityCommonResponseSchemaModel` 成功创建的模型
   */
  export namespace ModelCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaModel;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaModel;
  }

  /**
   * @description 删除模型
   * @tags Model
   * @name ModelDeletePost
   * @summary 删除模型
   * @request POST:/manage/model/delete/{model_id}
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace ModelDeletePost {
    export type RequestParams = {
      /** Model ID */
      modelId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取模型
   * @tags Model
   * @name ModelGet
   * @summary 获取模型
   * @request GET:/manage/model/{model_id}
   * @response `200` `ApiEntityCommonResponseSchemaModel` 模型
   */
  export namespace ModelGet {
    export type RequestParams = {
      /** Model ID */
      modelId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaModel;
  }

  /**
   * @description 批量获取模型
   * @tags Model
   * @name ModelListGet
   * @summary 批量获取模型
   * @request GET:/manage/model/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel` 模型列表
   */
  export namespace ModelListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel;
  }

  /**
   * @description 获取 API 提供商的模型
   * @tags Model
   * @name ModelProviderGet
   * @summary 获取 API 提供商的模型
   * @request GET:/manage/model/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel` 模型列表
   */
  export namespace ModelProviderGet {
    export type RequestParams = {
      /** Provider ID */
      providerId: number;
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel;
  }

  /**
   * @description 更新所有模型缓存，生产环境高危操作
   * @tags Model
   * @name ModelRefreshPost
   * @summary manageModelGroup
   * @request POST:/manage/model/refresh
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace ModelRefreshPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description Update 更新模型，若参数不传入或为空，则不会更新
   * @tags Model
   * @name ModelUpdatePost
   * @summary 更新模型
   * @request POST:/manage/model/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace ModelUpdatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaModel;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取权限
   * @tags Permission
   * @name PermissionGet
   * @summary 获取权限
   * @request GET:/manage/permission/{id}
   * @response `200` `ApiEntityCommonResponseSchemaPermission` 权限
   */
  export namespace PermissionGet {
    export type RequestParams = {
      /** 权限 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaPermission;
  }

  /**
   * @description 批量分页获取权限
   * @tags Permission
   * @name PermissionListGet
   * @summary 批量分页获取权限
   * @request GET:/manage/permission/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission` 权限列表
   */
  export namespace PermissionListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission;
  }

  /**
   * @description 更新权限
   * @tags Permission
   * @name PermissionUpdatePost
   * @summary 更新权限
   * @request POST:/manage/permission/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace PermissionUpdatePost {
    export type RequestParams = {
      /** 权限 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaPermission;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取所有 API 提供商
   * @tags Provider
   * @name ProviderAllGet
   * @summary 获取所有 API 提供商
   * @request GET:/manage/provider/all
   * @response `200` `ApiEntityCommonResponseArraySchemaProvider` API 提供商列表
   */
  export namespace ProviderAllGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseArraySchemaProvider;
  }

  /**
   * @description 创建 API 提供商
   * @tags Provider
   * @name ProviderCreatePost
   * @summary 创建 API 提供商
   * @request POST:/manage/provider/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的 API 提供商
   */
  export namespace ProviderCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProvider;
  }

  /**
   * @description 删除 API 提供商
   * @tags Provider
   * @name ProviderDeletePost
   * @summary 删除 API 提供商
   * @request POST:/manage/provider/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace ProviderDeletePost {
    export type RequestParams = {
      /** API 提供商 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取 API 提供商
   * @tags Provider
   * @name ProviderGet
   * @summary 获取 API 提供商
   * @request GET:/manage/provider/{provider_id}
   * @response `200` `ApiEntityCommonResponseSchemaProvider` API 提供商
   */
  export namespace ProviderGet {
    export type RequestParams = {
      /** API 提供商 ID */
      providerId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProvider;
  }

  /**
   * @description 批量获取 API 提供商
   * @tags Provider
   * @name ProviderListGet
   * @summary 批量获取 API 提供商
   * @request GET:/manage/provider/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider` API 提供商列表
   */
  export namespace ProviderListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider;
  }

  /**
   * @description 更新 API 提供商
   * @tags Provider
   * @name ProviderUpdatePost
   * @summary 更新 API 提供商
   * @request POST:/manage/provider/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace ProviderUpdatePost {
    export type RequestParams = {
      /** API 提供商 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaProvider;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 创建角色
   * @tags Role
   * @name RoleCreatePost
   * @summary 创建角色
   * @request POST:/manage/role/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的角色
   */
  export namespace RoleCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaRole;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProvider;
  }

  /**
   * @description 删除角色
   * @tags Role
   * @name RoleDeletePost
   * @summary 删除角色
   * @request POST:/manage/role/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace RoleDeletePost {
    export type RequestParams = {
      /** 角色 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取角色
   * @tags Role
   * @name RoleGet
   * @summary 获取角色
   * @request GET:/manage/role/{id}
   * @response `200` `ApiEntityCommonResponseSchemaRole` 角色
   */
  export namespace RoleGet {
    export type RequestParams = {
      /** 角色 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaRole;
  }

  /**
   * @description 批量分页获取角色
   * @tags Role
   * @name RoleListGet
   * @summary 批量分页获取角色
   * @request GET:/manage/role/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole` 角色列表
   */
  export namespace RoleListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole;
  }

  /**
   * @description 更新角色
   * @tags Role
   * @name RoleUpdatePost
   * @summary 更新角色
   * @request POST:/manage/role/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace RoleUpdatePost {
    export type RequestParams = {
      /** 角色 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiEntityReqUpdateBodySchemaRole;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 创建用户
   * @tags User
   * @name UserCreatePost
   * @summary 创建用户
   * @request POST:/manage/user/create
   * @response `200` `ApiEntityCommonResponseSchemaProvider` 成功创建的用户
   */
  export namespace UserCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaUser;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProvider;
  }

  /**
   * @description 删除用户
   * @tags User
   * @name UserDeletePost
   * @summary 删除用户
   * @request POST:/manage/user/{id}/delete
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace UserDeletePost {
    export type RequestParams = {
      /** 用户 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }

  /**
   * @description 获取用户
   * @tags User
   * @name UserGet
   * @summary 获取用户
   * @request GET:/manage/user/{id}
   * @response `200` `ApiEntityCommonResponseSchemaUser` 用户
   */
  export namespace UserGet {
    export type RequestParams = {
      /** 用户 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaUser;
  }

  /**
   * @description 批量分页获取用户
   * @tags User
   * @name UserListGet
   * @summary 批量分页获取用户
   * @request GET:/manage/user/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser` 用户列表
   */
  export namespace UserListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser;
  }

  /**
   * @description 强制登出用户
   * @tags User
   * @name UserLogoutPost
   * @summary 强制登出用户
   * @request POST:/manage/user/{id}/logout
   * @response `200` `ApiEntityCommonResponseInt` 成功登出的设备数量
   */
  export namespace UserLogoutPost {
    export type RequestParams = {
      /** 用户 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseInt;
  }

  /**
   * @description 更新用户
   * @tags User
   * @name UserUpdatePost
   * @summary 更新用户
   * @request POST:/manage/user/{id}/update
   * @response `200` `ApiEntityCommonResponseBool` 更新成功与否
   */
  export namespace UserUpdatePost {
    export type RequestParams = {
      /** 用户 ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaUser;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }
}
