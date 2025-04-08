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
  ApiEntityCommonResponseAny,
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseSchemaUser,
  ApiUserLoginLoginRequest,
  ApiUserRegisterRegisterRequest,
} from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class User<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 后门登录
   *
   * @tags User
   * @name BackdoorLoginPost
   * @summary 后门登录
   * @request POST:/user/backdoor/login
   * @response `200` `ApiEntityCommonResponseSchemaUser` login successfully
   */
  backdoorLoginPost = (req: ApiUserLoginLoginRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, any>({
      path: `/user/backdoor/login`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取当前用户信息
   *
   * @tags User
   * @name CurrentGet
   * @summary 获取当前用户信息
   * @request GET:/user/current
   * @response `200` `ApiEntityCommonResponseSchemaUser` get current user info successfully
   */
  currentGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, any>({
      path: `/user/current`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 用户登录
   *
   * @tags User
   * @name LoginPost
   * @summary 用户登录
   * @request POST:/user/login
   * @response `200` `ApiEntityCommonResponseSchemaUser` login successfully
   */
  loginPost = (req: ApiUserLoginLoginRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, any>({
      path: `/user/login`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 用户登出
   *
   * @tags User
   * @name LogoutPost
   * @summary 用户登出
   * @request POST:/user/logout
   */
  logoutPost = (params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/user/logout`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 检测客户端登录态
   *
   * @tags User
   * @name PingPost
   * @summary 检测客户端登录态
   * @request POST:/user/ping
   * @response `200` `ApiEntityCommonResponseSchemaUser` user is online
   * @response `404` `ApiEntityCommonResponseAny` user not found
   */
  pingPost = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaUser, ApiEntityCommonResponseAny>({
      path: `/user/ping`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 刷新登录态
   *
   * @tags User
   * @name RefreshGet
   * @summary 刷新登录态
   * @request GET:/user/refresh
   * @response `200` `string` nothing
   */
  refreshGet = (params: RequestParams = {}) =>
    this.http.request<string, any>({
      path: `/user/refresh`,
      method: "GET",
      ...params,
    });
  /**
   * @description 用户注册
   *
   * @tags User
   * @name RegisterPost
   * @summary 用户注册
   * @request POST:/user/register
   * @response `200` `ApiEntityCommonResponseBool` register successfully
   */
  registerPost = (req: ApiUserRegisterRegisterRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseBool, any>({
      path: `/user/register`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
