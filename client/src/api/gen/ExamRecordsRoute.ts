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

export namespace ExamRecords {
  /**
   * @description 获取用户的考试评分结果
   * @tags 考试
   * @name ExamRecordsGet
   * @summary 获取考试结果
   * @request GET:/exam-records/{id}
   * @response `200` `ApiEntityCommonResponseSchemaExamUserRecord` OK
   */
  export namespace ExamRecordsGet {
    export type RequestParams = {
      /** 考试记录ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaExamUserRecord;
  }
}
