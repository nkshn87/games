import { StateCreator } from "zustand";
import { MessageSlice, State } from "./slice-interfaces";

export const createMessageSlice: StateCreator<
  State, // すべてのデータの型
  [], // 利用するすべてのミドルウェアの配列
  [], // 配列
  MessageSlice
> = (set) => ({
  // ゲームの状態
  message: {
    texts: [""],
    to: null,
  },
  // ゲームの状態を変更する
  setMessage: (message) =>
    set((state) => {
      return { ...state, message };
    }),
});
