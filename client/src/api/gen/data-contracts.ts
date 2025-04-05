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

export interface ApiChatChatMessageListResponse {
  list?: ApiSchemaMessage[];
  /** 模型 ID -> 模型名称 */
  model_map?: Record<string, string>;
  next_page?: number;
}

export interface ApiChatCompletionStreamUserInput {
  bot_id?: number;
  enable_context?: boolean;
  /** 模型集合名称 */
  model_name: string;
  question: string;
  /** 系统提示词 */
  system_prompt?: string;
}

export interface ApiChatShareSessionShareRequest {
  active?: boolean;
  share_info?: ApiSchemaSessionShareInfo;
}

export interface ApiCourseMakeQuestionRequest {
  description: string;
  type: ApiSchemaProblemType;
}

export interface ApiEntityCommonResponseAny {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: any;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArrayEntityConfigChatModel {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityConfigChatModel[];
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseArraySchemaPreset {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaPreset[];
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

export interface ApiEntityCommonResponseChatChatMessageListResponse {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiChatChatMessageListResponse;
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

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaAPIKey {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaAPIKey;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaBucket {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaBucket;
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

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModel {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaModel;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaModelCollection {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaModelCollection;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaPermission {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaPermission;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProblem {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaProblem;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaProvider {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaProvider;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaRole {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaRole;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseEntityPaginatedTotalResponseSchemaUser {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiEntityPaginatedTotalResponseSchemaUser;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseExamSubmitExamResponse {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiExamSubmitExamResponse;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseExamSubmitProblemResponse {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiExamSubmitProblemResponse;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseInt {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: number;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaAPIKey {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaAPIKey;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaBucket {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaBucket;
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

export interface ApiEntityCommonResponseSchemaExamUserRecord {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaExamUserRecord;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaMessage {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaMessage;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaModel {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaModel;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaModelCollection {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaModelCollection;
  /** 消息 */
  msg?: string;
}

export interface ApiEntityCommonResponseSchemaPermission {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaPermission;
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

export interface ApiEntityCommonResponseSchemaRole {
  /** 代码 */
  code?: number;
  /** 数据 */
  data?: ApiSchemaRole;
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

export interface ApiEntityConfigChatModel {
  display_name?: string;
  is_default?: boolean;
  name?: string;
  order?: number;
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

export interface ApiEntityPaginatedTotalResponseSchemaAPIKey {
  list?: ApiSchemaAPIKey[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaBucket {
  list?: ApiSchemaBucket[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaCourse {
  list?: ApiSchemaCourse[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaModel {
  list?: ApiSchemaModel[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaModelCollection {
  list?: ApiSchemaModelCollection[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaPermission {
  list?: ApiSchemaPermission[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaProblem {
  list?: ApiSchemaProblem[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaProvider {
  list?: ApiSchemaProvider[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaRole {
  list?: ApiSchemaRole[];
  total?: number;
}

export interface ApiEntityPaginatedTotalResponseSchemaUser {
  list?: ApiSchemaUser[];
  total?: number;
}

export interface ApiEntityReqUpdateBodySchemaBucket {
  data: ApiSchemaBucket;
  /** @minItems 1 */
  updates: string[];
}

export interface ApiEntityReqUpdateBodySchemaModelCollection {
  data: ApiSchemaModelCollection;
  /** @minItems 1 */
  updates: string[];
}

export interface ApiEntityReqUpdateBodySchemaProblem {
  data: ApiSchemaProblem;
  /** @minItems 1 */
  updates: string[];
}

export interface ApiEntityReqUpdateBodySchemaRole {
  data: ApiSchemaRole;
  /** @minItems 1 */
  updates: string[];
}

export interface ApiExamSubmitExamRequest {
  /**
   * 答案列表
   * @minItems 1
   */
  answers?: ApiExamSubmitExamRequestAnswer[];
  /** 答题用时（秒） */
  time_spent?: number;
}

export interface ApiExamSubmitExamRequestAnswer {
  answer?: any;
  problem_id?: number;
}

export interface ApiExamSubmitExamResponse {
  /** 记录ID */
  record_id?: number;
}

export interface ApiExamSubmitProblemResponse {
  comment?: string;
  score?: number;
}

export interface ApiManageUpdateSystemConfigParams {
  name?: string;
  value?: Record<string, string>;
}

export interface ApiSchemaAPIKey {
  created_at?: string;
  id?: number;
  /** API 密钥 */
  key?: string;
  /** 外键，指向 Provider */
  provider_id?: number;
}

export interface ApiSchemaBucket {
  access_key_id?: string;
  bucket_name?: string;
  created_at?: string;
  display_name?: string;
  endpoint_url?: string;
  id?: number;
  region?: string;
  secret_access_key?: string;
  updated_at?: string;
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
  /** 考试限时（单位：秒） */
  limit_time?: number;
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

export interface ApiSchemaExamUserRecord {
  /** 用户答案（关联表储存） */
  answers?: ApiSchemaExamUserRecordAnswer[];
  created_at?: string;
  /** 组装字段 */
  exam?: ApiSchemaExam;
  /** 考试ID */
  exam_id?: number;
  /** 普通字段 */
  id?: number;
  /** 总评分状态 */
  status?: ApiSchemaScoreStatus;
  /** 答题用时（单位：秒） */
  time_spent?: number;
  /** 总得分（单位：0.01分） */
  total_score?: number;
  updated_at?: string;
  /** 用户ID */
  user_id?: number;
}

export interface ApiSchemaExamUserRecordAnswer {
  /** 用户答案 */
  answer?: any;
  /** 评语/反馈 */
  comments?: string;
  /** 测验 ID */
  exam_id?: number;
  /** 题目 ID */
  problem_id?: number;
  /** 得分（单位：0.01分） */
  score?: number;
  /** 评分状态 */
  status?: ApiSchemaScoreStatus;
}

export interface ApiSchemaMessage {
  content?: string;
  created_at?: string;
  extra?: object;
  /** 默认结构 */
  id?: number;
  /** 组装结构 */
  model?: ApiSchemaModel;
  /** 回复所使用的模型 */
  model_id?: number;
  preset?: ApiSchemaPreset;
  /** 回复所使用的预设 */
  preset_id?: number;
  reasoning_content?: string;
  /** user/assistant/system */
  role?: string;
  session_id?: string;
  token_usage?: number;
}

export interface ApiSchemaModel {
  /** 是否启用 */
  active?: boolean;
  /** 使用 JSON 储存配置 */
  config?: ApiSchemaModelConfig;
  created_at?: string;
  /** 额外模型描述 */
  description?: string;
  /** 对外展示模型名称 */
  display_name?: string;
  /** 原始数据 */
  id?: number;
  /** 模型名称 */
  name?: string;
  /** 组装数据 */
  provider?: ApiSchemaProvider;
  /** 关联的 Provider ID */
  provider_id?: number;
  updated_at?: string;
}

export interface ApiSchemaModelCollection {
  created_at?: string;
  /** 额外描述 */
  description?: string;
  /** 展示名称 */
  display_name?: string;
  id?: number;
  /** 关联的模型 */
  models?: ApiSchemaModel[];
  /** 唯一标识名称 */
  name?: string;
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
  /** 是否启用（唯一可设置的字段） */
  active?: boolean;
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

export interface ApiSchemaPreset {
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
  /** 角色所属模块（chat、tue 等） */
  type?: string;
  updated_at?: string;
  /** 预设版本号，可能被用于标记是否需要强制更新 */
  version?: number;
}

export interface ApiSchemaProblem {
  /** 答案（JSON存储ProblemAnswer） */
  answer?: ApiSchemaProblemAnswer;
  created_at?: string;
  /** 支持HTML/Markdown */
  description?: string;
  /**
   * 难度等级 1-5
   * @min 1
   * @max 5
   */
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
  EnumSingleChoice = "single_choice",
  EnumMultipleChoice = "multiple_choice",
  EnumFillBlank = "fill_blank",
  EnumShortAnswer = "short_answer",
  EnumTrueFalse = "true_false",
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
  /** 一对多关系，与 Model 模型关联 */
  models?: ApiSchemaModel[];
  /** 提供商名称 */
  name?: string;
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
  /** 是否启用 */
  active?: boolean;
  created_at?: string;
  /** 角色描述 */
  description?: string;
  /** 角色名称 */
  display_name?: string;
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 多对多关联 */
  permissions?: ApiSchemaPermission[];
  updated_at?: string;
}

export enum ApiSchemaScoreStatus {
  EnumStatusPending = "pending",
  EnumStatusScoring = "scoring",
  EnumStatusCompleted = "completed",
  EnumStatusFailed = "failed",
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
  password?: string;
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
