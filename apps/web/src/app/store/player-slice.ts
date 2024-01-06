import { StateCreator } from "zustand";
import { PlayersSlice, State } from "./slice-interfaces";
import { Player } from "../types";

const DEFAULT_PLAYERS: Player[] = [
  {
    name: "isao",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 0,
    color: "red",
  },
  {
    name: "hiroki",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 0,
    color: "blue",
  },
  {
    name: "shuhei",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 0,
    color: "green",
  },
  {
    name: "shun",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 15,
    color: "orange",
  },
];

export const createPlayersSlice: StateCreator<State, [], [], PlayersSlice> = (
  set,
  get,
) => ({
  players: DEFAULT_PLAYERS,
  currentPlayer: DEFAULT_PLAYERS[0],
  isRoundComp: false,
  isLastPlayer: false,
  nextPlayer: () => {
    let isLastPlayer = false;
    set((state) => {
      const players = state.players;
      const currentPlayer = state.currentPlayer;
      if (!currentPlayer || state.isLastPlayer) {
        // もしソート後だった場合、isLastPlayerなのにカレントプレイヤーが最後にいない可能性があるため一律0番目のプレイヤーを返す
        state.currentPlayer = players[0];
        console.log(
          "isLastPlayer",
          state.isLastPlayer,
          "currentPlayer",
          currentPlayer,
          "players",
          players,
          "players[0]",
          players[0],
        );
        return {
          ...state,
          currentPlayer: players[0],
          isLastPlayer,
          isRoundComp: false,
        };
      } else {
        console.log(
          "isLastPlayer",
          state.isLastPlayer,
          "currentPlayer",
          currentPlayer,
          "players",
          players,
        );
      }

      // indexは現在のプレイヤーのインデックス
      const index = players.findIndex((p) => p.name === currentPlayer.name);
      // 次のプレイヤーのインデックスを計算する
      const nextIndex = (index + 1) % players.length;
      const nextPlayer = players[nextIndex];
      if (nextIndex === players.length - 1) {
        // 最後のプレイヤーの順番になった。ただし、最後のプレイヤーのターンは終了していない（ラウンドは終わっていない）
        isLastPlayer = true;
      }
      console.log(players);
      console.log(
        "index",
        index,
        "nextIndex",
        nextIndex,
        "isLastPlayer",
        isLastPlayer,
      );
      console.log("nextPlayer", nextPlayer);

      return {
        ...state,
        currentPlayer: nextPlayer,
        isLastPlayer,
        isRoundComp: false,
      };
    });
  },
  sortPlayers: () =>
    new Promise<void>((resolve) => {
      set((state) => {
        const players = state.players.sort(
          (a, b) => (b.selectedTrumpValue || 0) - (a.selectedTrumpValue || 0),
        );
        return {
          ...state,
          players,
        };
      });
      resolve();
    }),
  addPlayer: (player) =>
    set((state) => {
      state.players.push(player);
      return state;
    }),
  assignRole: (player, role) =>
    set((state) => ({
      ...state,
      players: state.players.map((p) =>
        p.name === player.name ? { ...player, role } : p,
      ),
    })),
  fixPlayerRole: (player, role) => {
    get().fixRole(role);
    set((state) => ({
      ...state,
      players: state.players.map((p) =>
        p.name === player.name ? { ...player, role, fixed: true } : p,
      ),
    }));
  },
  movePlayer: (player, moveCount) =>
    set((state) => {
      const position = (player.position + moveCount) % 16;
      return {
        ...state,
        players: state.players.map((p) =>
          p.name === player.name ? { ...player, position } : p,
        ),
      };
    }),
  setSelectedTrump: (player, selectedTrumpValue) =>
    set((state) => {
      const currentPlayer = get().currentPlayer;
      if (currentPlayer.name !== player.name) {
        return state;
      }
      let isRoundComp = false;
      if (get().isLastPlayer) {
        isRoundComp = true;
      }
      return {
        ...state,
        players: state.players.map((p) =>
          p.name === player.name ? { ...player, selectedTrumpValue } : p,
        ),
        isRoundComp,
      };
    }),
});
