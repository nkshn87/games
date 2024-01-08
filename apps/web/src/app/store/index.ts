import { create } from "zustand";
import {
  GameStateSlice,
  MessageSlice,
  PlayersSlice,
  RolesSlice,
  TrumpsSlice,
} from "./slice-interfaces";
import { createPlayersSlice } from "./player-slice";
import { createRolesSlice } from "./role-slice";
import { createTrumpsSlice } from "./trump-slice";
import { createGameStateSlice } from "./game-state-slice";
import { createMessageSlice } from "./message-slice";
export { skipRole } from "./role-slice";

// すべてのデータはこの関数で管理する
export const useBoundStore = create<
  PlayersSlice & RolesSlice & TrumpsSlice & GameStateSlice & MessageSlice
>()((...a) => ({
  ...createPlayersSlice(...a),
  ...createRolesSlice(...a),
  ...createTrumpsSlice(...a),
  ...createGameStateSlice(...a),
  ...createMessageSlice(...a),
}));
