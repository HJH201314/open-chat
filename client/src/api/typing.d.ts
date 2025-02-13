declare namespace API {
  /* 只返回status */
  interface StatusResult {
    status: number;
  }

  /* 返回data */
  interface DataResult<T> {
    status: number;
    data: T;
  }

  type LoginResult = {
    id?: number;
    name?: string;
    permission?: number;
  };

  interface UserResult {
    user?: UserQueryResult;
  }

  interface UsersResult {
    users?: UserQueryResult[];
  }

  type UserCreateParam = {
    username?: string;
    password?: string;
    permission?: number;
  };

  type UserId = number;
  type UserName = string;
  type UserPassword = string;
  type UserPermission = number;
  type UserQueryResult = [UserId, UserName, UserPassword, UserPermission];

  type UserVO = {
    id?: number;
    username?: string;
    password?: string;
    permission?: number;
  };

  /**
   * number 为 role id
   * string 为 role name
   * */
  type RoleResult = [number, string];
  type RoleListResult = RoleResult[];

  type RoleSentenceResult = {
    roleSentence?: string;
  };

  /// 以上为旧类型

  interface CommonResponse<T> {
    code: number;
    msg: string;
    data: T;
  }

  type CommonBooleanResponse = CommonResponse<boolean>;
  type CommonStringResponse = CommonResponse<string>;
  type CommonNumberResponse = CommonResponse<number>;

  type UserLoginResult = {
    id?: number;
    username?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  type UserLoginResponse = CommonResponse<UserLoginResult>;

  type ChatCompletionOption = {
    sessionId: string;
    msg: string;
    withContext?: boolean;
    provider?: string;
    modelName?: string;
    systemPrompt?: string;
  };
}
