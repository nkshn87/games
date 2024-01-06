import { StateCreator } from "zustand";
import { Role } from "../types";
import { RolesSlice, State } from "./slice-interfaces";
import { calculateOuterNumbers } from "../components/utils";

const DEFAULT_ROLES: Role[] = [
  { name: "ファシリ", fixed: false },
  { name: "書記", fixed: false },
  { name: "1番目", fixed: false },
  { name: "2番目", fixed: false },
];

export const skipRole: Role = { name: "スキップ", fixed: false };
const BOARD_SIZE = 5;
const INNER_SIZE = BOARD_SIZE - 2;
const INNER_SQUARES = INNER_SIZE * INNER_SIZE;
const SQUARES = Array.from(
  { length: BOARD_SIZE * BOARD_SIZE - INNER_SQUARES + 1 },
  (_, i) => i + 1,
);
const i = SQUARES.length / DEFAULT_ROLES.length;
// DEFAULT_ROLESをi回繰り返す
const BOARD_ROLES = Array.from({ length: i }, (_, i) => DEFAULT_ROLES).flat();
// BOARD_ROLESを削ってでも3つskipRoleを入れる

// 余った分をskipRoleで埋める
let OPTION_ROLES_LENGTH = SQUARES.length - BOARD_ROLES.length;
if (OPTION_ROLES_LENGTH < 3) {
  const diff = 3 - OPTION_ROLES_LENGTH;
  OPTION_ROLES_LENGTH += diff;
  BOARD_ROLES.splice(BOARD_ROLES.length - diff, diff);
}
const OPTION_ROLES_LIST = Array.from(
  { length: OPTION_ROLES_LENGTH },
  (_, i) => skipRole,
).flat();
const BOARD_ROLES_LIST = BOARD_ROLES.concat(OPTION_ROLES_LIST);

export const createRolesSlice: StateCreator<State, [], [], RolesSlice> = (
  set,
  get,
) => ({
  // ボードの縦横サイズ（boardSliceを作るまではなさそうなのでここで。）
  boardSize: 5,
  // ボードのマス目
  squares: SQUARES,
  // ボードに表示する役職リスト squareの数だけ作る
  boardRoles: BOARD_ROLES_LIST,
  // Playerに割り当てる必要のある役職
  roles: DEFAULT_ROLES,
  addRole: (role) =>
    set((state) => {
      state.roles.push(role);
      return state;
    }),
  fixRole: (role) =>
    set((state) => ({
      ...state,
      roles: state.roles.map((r) =>
        r.name === role.name ? { ...role, fixed: true } : r,
      ),
    })),
  shuffleBoardRoles: () =>
    set((state) => {
      const shuffledRoles = state.boardRoles.sort(() => Math.random() - 0.5);
      return { ...state, boardRoles: shuffledRoles };
    }),
  getNewRole: (currentPlayer) => {
    const outerSquares = calculateOuterNumbers(get().boardSize);
    // TODO: ややこしすぎる。gridレイアウトに合わせてバックエンド実装したのアホすぎる
    const newRole = get().boardRoles[outerSquares[currentPlayer.position] - 1];
    return newRole;
  },
  getUnFixedRoles: () => {
    const roles = get().roles;
    return roles.filter((r) => !r.fixed);
  },
  replaceFixedRoles: () => {
    const unFixedRoles = get().getUnFixedRoles();
    const randomRole = getRandom(unFixedRoles);
    if (!randomRole) {
      return get().boardRoles;
    }
    const boardRoles = get().boardRoles.map((role) =>
      role.fixed ? randomRole : role,
    );
    set((state) => {
      return { ...state, boardRoles };
    });
    return boardRoles;
  },
});

function getRandom(undecidedRoles: Role[]) {
  // フィルタリングされた配列が空でない場合、ランダムな要素を返す
  if (undecidedRoles.length > 0) {
    const randomIndex = Math.floor(Math.random() * undecidedRoles.length);
    return undecidedRoles[randomIndex];
  }

  // undecidedRolesが空の場合、nullまたは適切な値を返す
  return null;
}
