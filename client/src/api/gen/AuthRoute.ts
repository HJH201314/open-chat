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
  ApiEntityCommonResponseSchemaUser,
  ApiEntityCommonResponseString,
  ApiUserLoginByOAuthReq,
} from './data-contracts';

export namespace Auth {
  /**
   * @description 前往 OAuth 认证
   * @tags User
   * @name GetAuth
   * @summary 前往 OAuth 认证
   * @request GET:/auth/{name}/url
   * @response `200` `ApiEntityCommonResponseString` OAuth 认证地址
   */
  export namespace GetAuth {
    export type RequestParams = {
      /** OAuth 名称 */
      name: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseString;
  }

  /**
   * @description OAuth 回调登录
   * @tags User
   * @name PostAuth
   * @summary OAuth 回调登录
   * @request POST:/auth/{name}/do
   * @response `200` `ApiEntityCommonResponseSchemaUser` 用户信息
   */
  export namespace PostAuth {
    export type RequestParams = {
      /** OAuth 名称 */
      name: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiUserLoginByOAuthReq;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaUser;
  }
}
