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
  bot_id?: number;
  enable_context?: boolean;
  /** Model.Name 准确的模型名称 */
  model_name: string;
  /** Provider.Name 准确的供应商名称 */
  provider_name: string;
  question: string;
  /** 系统提示词 */
  system_prompt?: string;
}

export interface ApiChatShareSessionShareRequest {
  active?: boolean;
  share_info?: ApiSchemaSessionShareInfo;
}

export interface ApiEntityCommonResponseAny {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: any;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArraySchemaBotRole {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaBotRole[];
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArraySchemaModelCache {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaModelCache[];
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArraySchemaProvider {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaProvider[];
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

export interface ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaMessage {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedContinuationResponseSchemaMessage;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaProblem {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedContinuationResponseSchemaProblem;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedContinuationResponseSchemaUserSession {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedContinuationResponseSchemaUserSession;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedSyncListResponseSchemaUserSession {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedSyncListResponseSchemaUserSession;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaCourse {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaCourse;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaCourse {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaCourse;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaExam {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaExam;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaProblem {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaProblem;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaProvider {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaProvider;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaSession {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaSession;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaUser {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaUser;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaUserSession {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaUserSession;
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

export interface ApiEntityPaginatedContinuationResponseSchemaMessage {
  list?: ApiSchemaMessage[];
  next_page?: number;
}

export interface ApiEntityPaginatedContinuationResponseSchemaProblem {
  list?: ApiSchemaProblem[];
  next_page?: number;
}

export interface ApiEntityPaginatedContinuationResponseSchemaUserSession {
  list?: ApiSchemaUserSession[];
  next_page?: number;
}

export interface ApiEntityPaginatedSyncListResponseSchemaUserSession {
  deleted?: ApiSchemaUserSession[];
  next_page?: number;
  updated?: ApiSchemaUserSession[];
}

export interface ApiEntityPaginatedTotalResponseSchemaCourse {
  last_page?: number;
  list?: ApiSchemaCourse[];
}

export interface ApiSchemaAPIKey {
  created_at?: string;
  id?: number;
  /** API 密钥 */
  key?: string;
  /** 外键，指向 Provider */
  provider_id?: number;
}

export interface ApiSchemaBotRole {
  created_at?: string;
  /** 角色描述 */
  description?: string;
  /** 原始数据 */
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 组装数据 */
  prompt_session?: ApiSchemaSession;
  /** 引用一个 session 中的对话作为 prompt */
  prompt_session_id?: string;
}

export interface ApiSchemaCourse {
  created_at?: string;
  /** 课程描述 */
  description?: string;
  /** 课程考试 */
  exams?: ApiSchemaCourseExam[];
  /** 原始数据 */
  id?: number;
  /** 课程名称 */
  name?: string;
  /** 关联数据 */
  resources?: ApiSchemaCourseResource[];
  /** 排好序的数据 */
  sorted_data?: any[];
  updated_at?: string;
}

export interface ApiSchemaCourseExam {
  /** 关联课程ID */
  course_id?: number;
  /** 考试详细信息 */
  exam?: ApiSchemaExam;
  /** 关联考试ID */
  exam_id?: number;
  id?: number;
  /** 考试排序 */
  sort_order?: number;
}

export interface ApiSchemaCourseResource {
  /** 关联课程ID */
  course_id?: number;
  id?: number;
  /** 资源详细信息 */
  resource?: ApiSchemaResource;
  /** 关联资源ID */
  resource_id?: number;
  /** 资源排序 */
  sort_order?: number;
}

export interface ApiSchemaExam {
  created_at?: string;
  /** 考试描述 */
  description?: string;
  id?: number;
  name?: string;
  /** 考试包含的大题 */
  problems?: ApiSchemaExamProblem[];
  /** 所属科目分类 */
  subjects?: string;
  /** 考试总分（单位：0.01分） */
  total_score?: number;
  updated_at?: string;
}

export interface ApiSchemaExamProblem {
  /** 关联考试ID */
  exam_id?: number;
  /** 题目详细信息 */
  problem?: ApiSchemaProblem;
  /** 关联题目ID */
  problem_id?: number;
  /** 题目分值（1表示0.01分） */
  score?: number;
  /** 题目排序 */
  sort_order?: number;
}

export interface ApiSchemaMessage {
  bot_role?: ApiSchemaBotRole;
  /** 回复所使用的模型 */
  bot_role_id?: number;
  content?: string;
  created_at?: string;
  /** 默认结构 */
  id?: number;
  /** 组装结构 */
  model?: ApiSchemaModel;
  /** 回复所使用的模型 */
  model_id?: number;
  reasoning_content?: string;
  /** user/assistant/system */
  role?: string;
  session_id?: string;
  token_usage?: number;
}

export interface ApiSchemaModel {
  /** 使用 JSON 储存配置 */
  config?: ApiSchemaModelConfig;
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

export interface ApiSchemaModelCache {
  /** 使用 JSON 储存配置 */
  config?: ApiSchemaModelConfig;
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
  /** 关联的 Provider FileName */
  provider_name?: string;
  updated_at?: string;
}

export interface ApiSchemaModelConfig {
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

export interface ApiSchemaPermission {
  created_at?: string;
  /** 权限描述 */
  description?: string;
  id?: number;
  /** 所属模块（handler名称） */
  module?: string;
  /** 权限名称 */
  name?: string;
  /** 权限路径（形如：POST:/user/create） */
  path?: string;
  updated_at?: string;
}

export interface ApiSchemaProblem {
  /** 答案（JSON存储ProblemAnswer） */
  answer?: ApiSchemaProblemAnswer;
  created_at?: string;
  /** 支持HTML/Markdown */
  description?: string;
  /** 难度等级 1-5 */
  difficulty?: number;
  /** 答案解析 */
  explanation?: string;
  id?: number;
  /** 选项（JSON存储ProblemOption数组） */
  options?: ApiSchemaProblemOption[];
  /** 所属科目/分类 */
  subject?: string;
  type?: ApiSchemaProblemType;
  updated_at?: string;
}

export interface ApiSchemaProblemAnswer {
  /**
   * 选择题：存储正确选项ID []uint
   * 填空题：存储多个填空关键词 []string
   * 判断题：true/false
   * 简答题：文本答案 string
   */
  answer?: any;
}

export interface ApiSchemaProblemOption {
  content?: string;
  /** 是否正确答案 */
  correct?: boolean;
  id?: number;
}

export enum ApiSchemaProblemType {
  EnumSingleChoice = 'single_choice',
  EnumMultipleChoice = 'multiple_choice',
  EnumFillBlank = 'fill_blank',
  EnumShortAnswer = 'short_answer',
  EnumTrueFalse = 'true_false',
}

export interface ApiSchemaProvider {
  /** 一对多关系，与 APIKey 模型关联 */
  api_keys?: ApiSchemaAPIKey[];
  /** API 的基本 URL */
  base_url?: string;
  created_at?: string;
  /** 额外提供商描述 */
  description?: string;
  /** 对外展示提供商名称 */
  display_name?: string;
  id?: number;
  /** 提供商名称 */
  name?: string;
  /** 一对多关系，与 Model 模型关联 */
  schema?: ApiSchemaModel[];
  updated_at?: string;
}

export interface ApiSchemaResource {
  created_at?: string;
  /** 资源描述 */
  description?: string;
  /** 文件的 uuid key */
  file_key?: string;
  /** OSS 中的文件名 */
  file_name?: string;
  id?: number;
  /** 原始文件名 */
  origin_file_name?: string;
  updated_at?: string;
}

export interface ApiSchemaRole {
  created_at?: string;
  /** 角色描述 */
  description?: string;
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 多对多关联 */
  permissions?: ApiSchemaPermission[];
  updated_at?: string;
}

export interface ApiSchemaSession {
  /** 上下文大小 */
  context_size?: number;
  created_at?: string;
  /** 上下文开关 */
  enable_context?: boolean;
  /** 原始数据 */
  id?: string;
  last_active?: string;
  /** 组装数据 */
  messages?: ApiSchemaMessage[];
  name?: string;
  /** 系统提示词 */
  system_prompt?: string;
  updated_at?: string;
}

export interface ApiSchemaSessionFlagInfo {
  /** 标星 */
  star?: boolean;
}

export interface ApiSchemaSessionShareInfo {
  /** 邀请码（可选） */
  code?: string;
  /** 邀请过期时间 */
  expired_at?: number;
  /** 是否永久分享 */
  permanent?: boolean;
  /** 分享标题 */
  title?: string;
}

export interface ApiSchemaUser {
  created_at?: string;
  id?: number;
  /** 用户与角色之间的多对多关系 */
  roles?: ApiSchemaRole[];
  updated_at?: string;
  username?: string;
}

export interface ApiSchemaUserSession {
  created_at?: string;
  flag_info?: ApiSchemaSessionFlagInfo;
  /** 组装数据 */
  session?: ApiSchemaSession;
  session_id?: string;
  /** 分享字段 */
  share_info?: ApiSchemaSessionShareInfo;
  type?: ApiSchemaUserSessionType;
  updated_at?: string;
  /** 原始数据 */
  user_id?: number;
}

export enum ApiSchemaUserSessionType {
  Enum_OWNER = 1,
  Enum_INVITEE = 2,
}

export interface ApiUserLoginLoginRequest {
  password: string;
  username: string;
}

export interface ApiUserRegisterRegisterRequest {
  password: string;
  username: string;
}
