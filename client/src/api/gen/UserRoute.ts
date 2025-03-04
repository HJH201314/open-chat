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
  ApiEntityCommonResponseBool,
  ApiEntityCommonResponseSchemaUser,
  ApiUserLoginLoginRequest,
  ApiUserRegisterRegisterRequest,
} from './data-contracts';

export namespace User {
  /**
   * @description 用户登录
   * @tags User
   * @name LoginPost
   * @summary 用户登录
   * @request POST:/user/login
   * @response `200` `ApiEntityCommonResponseSchemaUser` login successfully
   */
  export namespace LoginPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiUserLoginLoginRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaUser;
  }

  /**
   * @description 检测客户端登录态
   * @tags User
   * @name PingPost
   * @summary 检测客户端登录态
   * @request POST:/user/ping
   * @response `200` `ApiEntityCommonResponseSchemaUser` user is online
   * @response `404` `ApiEntityCommonResponseAny` user not found
   */
  export namespace PingPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaUser;
  }

  /**
   * @description 刷新登录态
   * @tags User
   * @name RefreshGet
   * @summary 刷新登录态
   * @request GET:/user/refresh
   * @response `200` `string` nothing
   */
  export namespace RefreshGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** 刷新用 Token */
      'X-Refresh-Token': string;
    };
    export type ResponseBody = string;
  }

  /**
   * @description 用户注册
   * @tags User
   * @name RegisterPost
   * @summary 用户注册
   * @request POST:/user/register
   * @response `200` `ApiEntityCommonResponseBool` register successfully
   */
  export namespace RegisterPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiUserRegisterRegisterRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }
}
