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
import type { HttpClient, RequestParams } from './http-client';
import { ContentType } from './http-client';

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 前往 OAuth 认证
   *
   * @tags User
   * @name GetAuth
   * @summary 前往 OAuth 认证
   * @request GET:/auth/{name}/url
   * @response `200` `ApiEntityCommonResponseString` OAuth 认证地址
   */
  getAuth = (name: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseString, any>({
      path: `/auth/${name}/url`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description OAuth 回调登录
   *
   * @tags User
   * @name PostAuth
   * @summary OAuth 回调登录
   * @request POST:/auth/{name}/do
   * @response `200` `ApiEntityCommonResponseSchemaUser` 用户信息
   */
  postAuth = (name: string, req: ApiUserLoginByOAuthReq, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, any>({
      path: `/auth/${name}/do`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
