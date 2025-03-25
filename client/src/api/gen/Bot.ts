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

import type { ApiSchemaBotRole } from "./data-contracts";
import type { HttpClient, RequestParams } from "./http-client";
import { ContentType } from "./http-client";

export class Bot<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description 创建一个新的机器人角色，包含名称、描述和引用的会话ID
   *
   * @tags BotRole
   * @name CreatePost
   * @summary 创建机器人角色
   * @request POST:/bot/create
   * @response `200` `ApiSchemaBotRole` 成功创建的机器人角色
   */
  createPost = (role: ApiSchemaBotRole, params: RequestParams = {}) =>
    this.http.request<ApiSchemaBotRole, any>({
      path: `/bot/create`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 删除指定ID的机器人角色
   *
   * @tags BotRole
   * @name DeletePost
   * @summary 删除机器人角色
   * @request POST:/bot/{id}/delete
   * @response `200` `boolean` 删除成功
   */
  deletePost = (id: number, params: RequestParams = {}) =>
    this.http.request<boolean, any>({
      path: `/bot/${id}/delete`,
      method: "POST",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 根据ID获取指定的机器人角色信息
   *
   * @tags BotRole
   * @name GetBot
   * @summary 获取机器人角色
   * @request GET:/bot/{id}
   * @response `200` `ApiSchemaBotRole` 机器人角色信息
   */
  getBot = (id: number, params: RequestParams = {}) =>
    this.http.request<ApiSchemaBotRole, any>({
      path: `/bot/${id}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取所有机器人角色的列表
   *
   * @tags BotRole
   * @name ListGet
   * @summary 获取机器人角色列表
   * @request GET:/bot/list
   * @response `200` `(ApiSchemaBotRole)[]` 机器人角色列表
   */
  listGet = (params: RequestParams = {}) =>
    this.http.request<ApiSchemaBotRole[], any>({
      path: `/bot/list`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 更新指定ID的机器人角色信息
   *
   * @tags BotRole
   * @name UpdatePost
   * @summary 更新机器人角色
   * @request POST:/bot/{id}/update
   * @response `200` `ApiSchemaBotRole` 更新后的机器人角色信息
   */
  updatePost = (id: number, role: ApiSchemaBotRole, params: RequestParams = {}) =>
    this.http.request<ApiSchemaBotRole, any>({
      path: `/bot/${id}/update`,
      method: "POST",
      body: role,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
