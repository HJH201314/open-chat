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
import type { HttpClient, RequestParams } from "./http-client";

export class Base<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取公钥
   *
   * @tags Base
   * @name PublicKeyGet
   * @summary 获取公钥
   * @request GET:/base/public-key
   * @response `200` `ApiEntityCommonResponseString` RSA 公钥
   */
  publicKeyGet = (params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseString, any>({
      path: `/base/public-key`,
      method: "GET",
      format: "json",
      ...params,
    });
}
