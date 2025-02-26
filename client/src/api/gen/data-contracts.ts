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

export interface ApiChatCompletionStreamUserInput {
  enable_context?: boolean;
  /** Model.Name 准确的模型名称 */
  model_name: string;
  /** Provider.Name 准确的供应商名称 */
  provider_name: string;
  question: string;
  /** 系统提示词 */
  system_prompt?: string;
}

export interface ApiEntityCommonResponseAny {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: any;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArrayModelsModelCache {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiModelsModelCache[];
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArrayModelsProvider {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiModelsProvider[];
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseBool {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: boolean;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseModelsProvider {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiModelsProvider;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseModelsUser {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiModelsUser;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseString {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: string;
  /** 消息 */
  msg?: string;
}

export interface ApiModelsAPIKey {
  created_at?: string;
  id?: number;
  /** API 密钥 */
  key?: string;
  /** 外键，指向 Provider */
  provider_id?: number;
}

export interface ApiModelsModel {
  /** 使用 JSON 储存配置 */
  config?: ApiModelsModelConfig;
  created_at?: string;
  /** 额外模型描述 */
  description?: string;
  /** 对外展示模型名称 */
  display_name?: string;
  id?: number;
  /** 模型名称 */
  name?: string;
  /** 关联的 Provider ID */
  provider_id?: number;
  updated_at?: string;
}

export interface ApiModelsModelCache {
  /** 使用 JSON 储存配置 */
  config?: ApiModelsModelConfig;
  created_at?: string;
  /** 额外模型描述 */
  description?: string;
  /** 对外展示模型名称 */
  display_name?: string;
  id?: number;
  /** 模型名称 */
  name?: string;
  /** 关联的 Provider DisplayName */
  provider_display_name?: string;
  /** 关联的 Provider ID */
  provider_id?: number;
  /** 关联的 Provider Name */
  provider_name?: string;
  updated_at?: string;
}

export interface ApiModelsModelConfig {
  /** 是否允许用户自行修改系统提示 */
  allow_system_prompt?: boolean;
  /** 默认温度 */
  default_temperature?: number;
  frequency_penalty?: number;
  max_tokens?: number;
  presence_penalty?: number;
  /** 预设系统提示 */
  system_prompt?: string;
  top_p?: number;
}

export interface ApiModelsPermission {
  created_at?: string;
  /** 权限描述 */
  description?: string;
  id?: number;
  /** 权限名称 */
  name?: string;
  /** 权限路径（一般与名称相同） */
  path?: string;
  updated_at?: string;
}

export interface ApiModelsProvider {
  /** 一对多关系，与 APIKey 模型关联 */
  api_keys?: ApiModelsAPIKey[];
  /** API 的基本 URL */
  base_url?: string;
  created_at?: string;
  /** 额外提供商描述 */
  description?: string;
  /** 对外展示提供商名称 */
  display_name?: string;
  id?: number;
  /** 一对多关系，与 Model 模型关联 */
  models?: ApiModelsModel[];
  /** 提供商名称 */
  name?: string;
  updated_at?: string;
}

export interface ApiModelsRole {
  created_at?: string;
  /** 角色描述 */
  description?: string;
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 多对多关联 */
  permissions?: ApiModelsPermission[];
  updated_at?: string;
}

export interface ApiModelsUser {
  created_at?: string;
  id?: number;
  /** 用户与角色之间的多对多关系 */
  roles?: ApiModelsRole[];
  updated_at?: string;
  username?: string;
}

export interface ApiUserLoginLoginRequest {
  password: string;
  username: string;
}

export interface ApiUserRegisterRegisterRequest {
  password: string;
  username: string;
}
