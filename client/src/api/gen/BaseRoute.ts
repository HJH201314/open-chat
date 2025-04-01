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

import type { ApiEntityCommonResponseString } from "./data-contracts";

export namespace Base {
  /**
   * @description 获取公钥
   * @tags Base
   * @name PublicKeyGet
   * @summary 获取公钥
   * @request GET:/base/public-key
   * @response `200` `ApiEntityCommonResponseString` RSA 公钥
   */
  export namespace PublicKeyGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseString;
  }
}
