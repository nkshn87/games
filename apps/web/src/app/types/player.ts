import { Role } from ".";

export type Player = {
  // なまえ
  name: string;
  // 役職
  role: Role | null;
  // 役職が確定しているかどうか
  fixed: boolean;
  // プレイヤーの場所
  position: number;
  // カードを引く順番
  selectedTrumpValue: number | null;
  // カラー
  color: string;
  // スキップを使ったか
  usedSkip: boolean;
};
