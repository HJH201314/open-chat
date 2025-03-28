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
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider,
  ApiEntityCommonResponseSchemaAPIKey,
  ApiEntityCommonResponseSchemaModel,
  ApiEntityCommonResponseSchemaModelCollection,
  ApiEntityCommonResponseSchemaProvider,
  ApiSchemaAPIKey,
  ApiSchemaModel,
  ApiSchemaModelCollection,
  ApiSchemaProvider,
} from "./data-contracts";

export namespace Manage {
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
   * @request POST:/manage/collection/delete/{collection_id}
   * @response `200` `ApiEntityCommonResponseBool` 删除成功与否
   */
  export namespace CollectionDeletePost {
    export type RequestParams = {
      /** ModelCollection ID */
      collectionId: number;
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
   * @request GET:/manage/collection/{collection_id}
   * @response `200` `ApiEntityCommonResponseSchemaModelCollection` 模型
   */
  export namespace CollectionGet {
    export type RequestParams = {
      /** ModelCollection ID */
      collectionId: number;
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
}
