import { StateCreator } from "zustand";
import { Trump } from "../types";
import { TrumpsSlice, State } from "./slice-interfaces";

const DEFAULT_TRUMPS: Trump[] = [
  { value: 1, isOpened: false, frontImagePath: "/heart_1.png" },
  { value: 2, isOpened: false, frontImagePath: "/heart_2.png" },
  { value: 3, isOpened: false, frontImagePath: "/heart_3.png" },
  { value: 4, isOpened: false, frontImagePath: "/heart_4.png" },
  { value: 5, isOpened: false, frontImagePath: "/heart_5.png" },
  { value: 6, isOpened: false, frontImagePath: "/heart_6.png" },
];

export const createTrumpsSlice: StateCreator<State, [], [], TrumpsSlice> = (
  set,
) => ({
  trumps: DEFAULT_TRUMPS,
  selectedTrump: null,
  isDisabled: false,
  flipTrump: (trump) =>
    set((state) => ({
      ...state,
      trumps: state.trumps.map((t) =>
        t.value === trump.value ? { ...t, isOpened: !t.isOpened } : t,
      ),
    })),
  selectTrump: (trump) =>
    set((state) => ({
      ...state,
      selectedTrump: trump,
    })),
  shuffleTrumps: () =>
    set((state) => ({
      ...state,
      trumps: state.trumps.sort(() => Math.random() - 0.5),
    })),
  allClose: () =>
    set((state) => ({
      ...state,
      trumps: state.trumps.map((t) =>
        t.isOpened ? { ...t, isOpened: false } : t,
      ),
    })),
  clearSelectedTrump: () =>
    set((state) => ({
      ...state,
      selectedTrump: null,
    })),
  disableTrumps: () =>
    set((state) => ({
      ...state,
      isDisabled: true,
    })),
  enableTrumps: () =>
    set((state) => ({
      ...state,
      isDisabled: false,
    })),
});
