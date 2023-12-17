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
  }

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
  }

  type UserId = number;
  type UserName = string;
  type UserPassword = string;
  type UserPermission = number;
  type UserQueryResult = [UserId, UserName, UserPassword, UserPermission]

  type UserVO = {
    id?: number;
    username?: string;
    password?: string;
    permission?: number;
  }

  /**
   * number 为 role id
   * string 为 role name
   * */
  type RoleResult = [number, string]
  type RoleListResult = RoleResult[]
}