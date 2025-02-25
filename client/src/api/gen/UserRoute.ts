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
  ApiEntityCommonResponseModelsUser,
  ApiUserLoginLoginRequest,
  ApiUserRegisterRegisterRequest,
} from './data-contracts';

export namespace User {
  /**
   * @description 用户登录
   * @tags User
   * @name LoginCreate
   * @summary 用户登录
   * @request POST:/user/login
   * @response `200` `ApiEntityCommonResponseModelsUser` login successfully
   */
  export namespace LoginCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiUserLoginLoginRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseModelsUser;
  }

  /**
   * @description 检测客户端登录态
   * @tags User
   * @name PingCreate
   * @summary 检测客户端登录态
   * @request POST:/user/ping
   * @response `200` `ApiEntityCommonResponseModelsUser` user is online
   * @response `404` `ApiEntityCommonResponseAny` user not found
   */
  export namespace PingCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseModelsUser;
  }

  /**
   * @description 用户注册
   * @tags User
   * @name RegisterCreate
   * @summary 用户注册
   * @request POST:/user/register
   * @response `200` `ApiEntityCommonResponseBool` register successfully
   */
  export namespace RegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiUserRegisterRegisterRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseBool;
  }
}
