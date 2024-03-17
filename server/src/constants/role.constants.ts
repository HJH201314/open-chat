export class Role {
  private static roleMap = new Map([
    [0, 'GUEST'],
    [1, 'SUPER_ADMIN'],
    [2, 'ADMIN'],
    [3, 'USER'],
  ]);
  static GUEST = this.fromId(0);
  static SUPER_ADMIN = this.fromId(1);
  static ADMIN = this.fromId(2);
  static USER = this.fromId(3);

  private readonly roleId: number;
  private readonly roleName: string;

  constructor(roleId: number, roleName: string) {
    this.roleId = roleId;
    this.roleName = roleName;
  }

  static fromId(roleId: number) {
    const roleName = this.roleMap.get(roleId);
    if (roleName) {
      return new Role(roleId, roleName);
    } else {
      return new Role(0, 'GUEST');
    }
  }

  getRoleId() {
    return this.roleId;
  }

  getRoleName() {
    return this.roleName;
  }
}
