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

import type { ApiEntityCommonResponseExamSubmitExamResponse, ApiExamSubmitExamRequest } from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class Exams<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 提交用户的考试答案并进行评分
   *
   * @tags 考试
   * @name SubmitPost
   * @summary 提交考试答案
   * @request POST:/exams/{id}/submit
   * @response `200` `ApiEntityCommonResponseExamSubmitExamResponse` OK
   */
  submitPost = (id: number, request: ApiExamSubmitExamRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseExamSubmitExamResponse, any>({
      path: `/exams/${id}/submit`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
