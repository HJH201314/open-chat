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

import type {
  ApiEntityCommonResponseAny,
  ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem,
  ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse,
  ApiEntityCommonResponseExamSubmitExamResponse,
  ApiEntityCommonResponseSchemaCourse,
  ApiEntityCommonResponseSchemaExam,
  ApiEntityCommonResponseSchemaExamUserRecord,
  ApiEntityCommonResponseSchemaProblem,
  ApiExamSubmitExamRequest,
  ApiSchemaCourse,
  ApiSchemaExam,
  ApiSchemaProblem,
} from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class Tue<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建课程基础参数，绑定或创建题目、资源
   *
   * @tags Course
   * @name CourseCreatePost
   * @summary 创建课程
   * @request POST:/tue/course/create
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  courseCreatePost = (req: ApiSchemaCourse, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaCourse, any>({
      path: `/tue/course/create`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取单个课程
   *
   * @tags Course
   * @name CourseGet
   * @summary 获取单个课程
   * @request GET:/tue/course/{id}
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  courseGet = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaCourse, any>({
      path: `/tue/course/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取课程列表
   *
   * @tags Course
   * @name CourseListGet
   * @summary 获取课程列表
   * @request GET:/tue/course/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse` 返回数据
   */
  courseListGet = (
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
    this.http.request<ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse, any>({
      path: `/tue/course/list`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除课程
   *
   * @tags Course
   * @name CoursePost
   * @summary 删除课程
   * @request POST:/tue/course/{id}
   * @response `200` `ApiEntityCommonResponseAny` 返回数据
   */
  coursePost = (id: string, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseAny, any>({
      path: `/tue/course/${id}`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新课程基础参数，增量更新 题目、资源
   *
   * @tags Course
   * @name CourseUpdatePost
   * @summary 更新课程
   * @request POST:/tue/course/update
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  courseUpdatePost = (req: ApiSchemaCourse, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaCourse, any>({
      path: `/tue/course/update`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 保存单个测验
   *
   * @tags Exam
   * @name ExamCreatePost
   * @summary 保存单个测验
   * @request POST:/tue/exam/create
   * @response `200` `ApiEntityCommonResponseSchemaExam` 返回数据
   */
  examCreatePost = (req: ApiSchemaExam, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaExam, any>({
      path: `/tue/exam/create`,
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
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
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取用户的考试评分结果
   *
   * @tags 考试
   * @name ExamRecordsGet
   * @summary 获取考试结果
   * @request GET:/tue/exam/{id}/records
   * @response `200` `ApiEntityCommonResponseSchemaExamUserRecord` OK
   */
  examRecordsGet = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseSchemaExamUserRecord, any>({
      path: `/tue/exam/${id}/records`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 管理员重新评分考试
   *
   * @tags 考试
   * @name ExamRescorePost
   * @summary 重新评分考试
   * @request POST:/tue/exam/{id}/rescore
   */
  examRescorePost = (id: number, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/tue/exam/${id}/rescore`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 提交用户的考试答案并进行评分
   *
   * @tags 考试
   * @name ExamSubmitPost
   * @summary 提交考试答案
   * @request POST:/tue/exam/{id}/submit
   * @response `200` `ApiEntityCommonResponseExamSubmitExamResponse` OK
   */
  examSubmitPost = (id: number, request: ApiExamSubmitExamRequest, params: RequestParams = {}) =>
    this.http.request<ApiEntityCommonResponseExamSubmitExamResponse, any>({
      path: `/tue/exam/${id}/submit`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
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
      method: "POST",
      body: req,
      type: ContentType.Json,
      format: "json",
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
      method: "GET",
      type: ContentType.Json,
      format: "json",
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
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
