import { StateCreator } from "zustand";
import { GameStateSlice, State } from "./slice-interfaces";

export const createGameStateSlice: StateCreator<
  State, // すべてのデータの型
  [], // 利用するすべてのミドルウェアの配列
  [], // 配列
  GameStateSlice
> = (set) => ({
  // ゲームの状態
  gameState: "inputPhase",
  // ゲームの状態を変更する
  setGameState: (gameState) =>
    set((state) => {
      return { ...state, gameState };
    }),
});
