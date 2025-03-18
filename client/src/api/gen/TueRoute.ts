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
  ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem,
  ApiEntityCommonResponseSchemaExam,
  ApiEntityCommonResponseSchemaProblem,
  ApiSchemaExam,
  ApiSchemaProblem,
} from './data-contracts';

export namespace Tue {
  /**
   * @description 保存单个测验
   * @tags Exam
   * @name ExamCreateGet
   * @summary 保存单个测验
   * @request GET:/tue/exam/create
   * @response `200` `ApiEntityCommonResponseSchemaExam` 返回数据
   */
  export namespace ExamCreateGet {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaExam;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaExam;
  }

  /**
   * @description 获取单个测验
   * @tags Exam
   * @name ExamGet
   * @summary 获取单个测验
   * @request GET:/tue/exam/{id}
   * @response `200` `ApiEntityCommonResponseSchemaExam` 返回数据
   */
  export namespace ExamGet {
    export type RequestParams = {
      /** 测验 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaExam;
  }

  /**
   * @description 创建单个题目
   * @tags Problem
   * @name ProblemCreatePost
   * @summary 创建单个题目
   * @request POST:/tue/problem/create
   * @response `200` `ApiEntityCommonResponseSchemaProblem` 返回数据
   */
  export namespace ProblemCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaProblem;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProblem;
  }

  /**
   * @description 获取单个题目
   * @tags Problem
   * @name ProblemGet
   * @summary 获取单个题目
   * @request GET:/tue/problem/{id}
   * @response `200` `ApiEntityCommonResponseSchemaProblem` 返回数据
   */
  export namespace ProblemGet {
    export type RequestParams = {
      /** 题目 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaProblem;
  }

  /**
   * @description 分页获取题目列表
   * @tags Problem
   * @name ProblemListGet
   * @summary 分页获取题目列表
   * @request GET:/tue/problem/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem` 返回数据
   */
  export namespace ProblemListGet {
    export type RequestParams = {};
    export type RequestQuery = {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem;
  }
}
