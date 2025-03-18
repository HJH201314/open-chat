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
import type { HttpClient, RequestParams } from './http-client';
import { ContentType } from './http-client';

export class Tue<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 保存单个测验
   *
   * @tags Exam
   * @name ExamCreateGet
   * @summary 保存单个测验
   * @request GET:/tue/exam/create
   * @response `200` `ApiEntityCommonResponseSchemaExam` 返回数据
   */
  examCreateGet = (req: ApiSchemaExam, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaExam, any>({
      path: `/tue/exam/create`,
      method: 'GET',
      body: req,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 获取单个测验
   *
   * @tags Exam
   * @name ExamGet
   * @summary 获取单个测验
   * @request GET:/tue/exam/{id}
   * @response `200` `ApiEntityCommonResponseSchemaExam` 返回数据
   */
  examGet = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaExam, any>({
      path: `/tue/exam/${id}`,
      method: 'GET',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 创建单个题目
   *
   * @tags Problem
   * @name ProblemCreatePost
   * @summary 创建单个题目
   * @request POST:/tue/problem/create
   * @response `200` `ApiEntityCommonResponseSchemaProblem` 返回数据
   */
  problemCreatePost = (req: ApiSchemaProblem, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProblem, any>({
      path: `/tue/problem/create`,
      method: 'POST',
      body: req,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 获取单个题目
   *
   * @tags Problem
   * @name ProblemGet
   * @summary 获取单个题目
   * @request GET:/tue/problem/{id}
   * @response `200` `ApiEntityCommonResponseSchemaProblem` 返回数据
   */
  problemGet = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaProblem, any>({
      path: `/tue/problem/${id}`,
      method: 'GET',
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * @description 分页获取题目列表
   *
   * @tags Problem
   * @name ProblemListGet
   * @summary 分页获取题目列表
   * @request GET:/tue/problem/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem` 返回数据
   */
  problemListGet = (
    query: {
      end_time?: number;
      /** 分页参数 */
      page_num: number;
      page_size?: number;
      sort_expr?: string;
      start_time?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem, any>({
      path: `/tue/problem/list`,
      method: 'GET',
      query: query,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
