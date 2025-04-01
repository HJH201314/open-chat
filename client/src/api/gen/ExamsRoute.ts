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

export namespace Exams {
  /**
   * @description 提交用户的考试答案并进行评分
   * @tags 考试
   * @name SubmitPost
   * @summary 提交考试答案
   * @request POST:/exams/{id}/submit
   * @response `200` `ApiEntityCommonResponseExamSubmitExamResponse` OK
   */
  export namespace SubmitPost {
    export type RequestParams = {
      /** 考试ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiExamSubmitExamRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseExamSubmitExamResponse;
  }
}
