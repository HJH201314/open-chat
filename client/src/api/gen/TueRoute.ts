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

export namespace Tue {
  /**
   * @description 创建课程基础参数，绑定或创建题目、资源
   * @tags Course
   * @name CourseCreatePost
   * @summary 创建课程
   * @request POST:/tue/course/create
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  export namespace CourseCreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaCourse;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaCourse;
  }

  /**
   * @description 获取单个课程
   * @tags Course
   * @name CourseGet
   * @summary 获取单个课程
   * @request GET:/tue/course/{id}
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  export namespace CourseGet {
    export type RequestParams = {
      /** 课程 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaCourse;
  }

  /**
   * @description 获取课程列表
   * @tags Course
   * @name CourseListGet
   * @summary 获取课程列表
   * @request GET:/tue/course/list
   * @response `200` `ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse` 返回数据
   */
  export namespace CourseListGet {
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
    export type ResponseBody = ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse;
  }

  /**
   * @description 删除课程
   * @tags Course
   * @name CoursePost
   * @summary 删除课程
   * @request POST:/tue/course/{id}
   * @response `200` `ApiEntityCommonResponseAny` 返回数据
   */
  export namespace CoursePost {
    export type RequestParams = {
      /** 课程 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseAny;
  }

  /**
   * @description 更新课程基础参数，增量更新 题目、资源
   * @tags Course
   * @name CourseUpdatePost
   * @summary 更新课程
   * @request POST:/tue/course/update
   * @response `200` `ApiEntityCommonResponseSchemaCourse` 返回数据
   */
  export namespace CourseUpdatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ApiSchemaCourse;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseSchemaCourse;
  }

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
   * @description 获取用户的考试评分结果
   * @tags 考试
   * @name ExamRecordsGet
   * @summary 获取考试结果
   * @request GET:/tue/exam/{id}/records
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

  /**
   * @description 管理员重新评分考试
   * @tags 考试
   * @name ExamRescorePost
   * @summary 重新评分考试
   * @request POST:/tue/exam/{id}/rescore
   */
  export namespace ExamRescorePost {
    export type RequestParams = {
      /** 考试记录ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * @description 提交用户的考试答案并进行评分
   * @tags 考试
   * @name ExamSubmitPost
   * @summary 提交考试答案
   * @request POST:/tue/exam/{id}/submit
   * @response `200` `ApiEntityCommonResponseExamSubmitExamResponse` OK
   */
  export namespace ExamSubmitPost {
    export type RequestParams = {
      /** 考试ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ApiExamSubmitExamRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ApiEntityCommonResponseExamSubmitExamResponse;
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
