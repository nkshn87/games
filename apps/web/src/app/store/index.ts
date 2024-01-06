import { create } from "zustand";
import {
  GameStateSlice,
  PlayersSlice,
  RolesSlice,
  TrumpsSlice,
} from "./slice-interfaces";
import { createPlayersSlice } from "./player-slice";
import { createRolesSlice } from "./role-slice";
import { createTrumpsSlice } from "./trump-slice";
import { createGameStateSlice } from "./game-state-slice";
export { skipRole } from "./role-slice";

// すべてのデータはこの関数で管理する
export const useBoundStore = create<
  PlayersSlice & RolesSlice & TrumpsSlice & GameStateSlice
>()((...a) => ({
  ...createPlayersSlice(...a),
  ...createRolesSlice(...a),
  ...createTrumpsSlice(...a),
  ...createGameStateSlice(...a),
}));
