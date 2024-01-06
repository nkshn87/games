import { StateCreator } from "zustand";
import { GameStateSlice, State } from "./slice-interfaces";
import { GameStateEnum } from "../types";

export const createGameStateSlice: StateCreator<
  State, // すべてのデータの型
  [], // 利用するすべてのミドルウェアの配列
  [], // 配列
  GameStateSlice
> = (set, get) => ({
  // ゲームの状態
  gameState: GameStateEnum.inputPhase,
  // ゲームの状態を変更する
  setGameState: (gameState) =>
    set((state) => {
      return { ...state, gameState };
    }),
});
