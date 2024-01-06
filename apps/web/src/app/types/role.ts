export type Role = {
  name: RoleType;
  fixed: boolean;
};

export type RoleType = MainRole | SkipRole;
export type MainRole = "ファシリ" | "書記" | "1番目" | "2番目";
export type SkipRole = "スキップ";
