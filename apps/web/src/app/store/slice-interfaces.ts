import { GameStateEnumKeys, Player, Role, Trump } from "../types";

export interface PlayersSlice {
  players: Player[];
  isRoundComp: boolean;
  isLastPlayer: boolean;
  currentPlayer: Player;
  // 現在のプレイヤーを次のプレイヤーに移す。一周したら最初のプレイヤーに戻り、Trueを返す
  nextPlayer: () => void;
  // プレイヤーを追加する
  addPlayer: (player: Player) => void;
  // 特定のプレイヤーに特定の役職を仮で割り当てる
  assignRole: (player: Player, role: Role) => void;
  // 並び替え
  sortPlayers: () => void;
  // 役職を確定する
  checkPlayersAndFixRole: () => boolean;
  // プレイヤーの場所を移動する
  movePlayer: (player: Player, position: Player["position"]) => Player;
  // 選択されたトランプを設定する
  setSelectedTrump: (
    player: Player,
    selectedTrumpValue: Player["selectedTrumpValue"],
  ) => void;
  // スキップを使った
  useSkip: (player: Player) => Player;
}

export interface RolesSlice {
  boardSize: number;
  squares: number[];
  // ボードに表示する役職リスト
  boardRoles: Role[];
  // Playerに割り当てる必要のある役職
  roles: Role[];
  // 役職を追加する
  addRole: (role: Role) => void;
  // 役職を確定する
  fixRole: (role: Role) => void;
  // シャッフルする
  shuffleBoardRoles: () => void;
  // プレイヤーの新しい役職を取得する（すごろくで移動した直後に実行する想定）
  getNewRole: (currentPlayer: Player) => Role;
  // 確定していない役職を取得する
  getUnFixedRoles: () => Role[];
  replaceFixedRoles: () => Role[];
}

export interface TrumpsSlice {
  trumps: Trump[];
  // 現在選択されているトランプ
  selectedTrump: Trump | null;
  // トランプをクリックできるかどうか
  isDisabled: boolean;
  // トランプをひっくり返す
  flipTrump: (trump: Trump) => void;
  // トランプを選択する
  selectTrump: (trump: Trump) => void;
  // シャッフルする
  shuffleTrumps: () => void;
  // 全てを裏返す
  allClose: () => void;
  // 選択されているトランプをクリアする
  clearSelectedTrump: () => void;
  // トランプをクリックできない状態にする
  disableTrumps: () => void;
  // トランプをクリックできる状態にする
  enableTrumps: () => void;
}

export interface GameStateSlice {
  // ゲームの状態
  gameState: GameStateEnumKeys;
  // ゲームの状態を変更する
  setGameState: (state: GameStateEnumKeys) => void;
}

export interface RolePlayerSlice {
  // 役職を持っているプレイヤー
  rolePlayer: Player | null;
  // 役職を持っているプレイヤーを設定する
  setRolePlayer: (player: Player) => void;
}

export type State = PlayersSlice & RolesSlice & TrumpsSlice & GameStateSlice;
