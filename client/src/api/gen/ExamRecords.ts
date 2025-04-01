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

import type { ApiEntityCommonResponseSchemaExamUserRecord } from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class ExamRecords<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 获取用户的考试评分结果
   *
   * @tags 考试
   * @name ExamRecordsGet
   * @summary 获取考试结果
   * @request GET:/exam-records/{id}
   * @response `200` `ApiEntityCommonResponseSchemaExamUserRecord` OK
   */
  examRecordsGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaExamUserRecord, any>({
      path: `/exam-records/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
