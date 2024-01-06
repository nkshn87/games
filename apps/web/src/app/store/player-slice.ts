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
    usedSkip: false,
  },
  {
    name: "hiroki",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 0,
    color: "blue",
    usedSkip: false,
  },
  {
    name: "shuhei",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 0,
    color: "green",
    usedSkip: false,
  },
  {
    name: "shun",
    selectedTrumpValue: 1,
    role: null,
    fixed: false,
    position: 15,
    color: "orange",
    usedSkip: false,
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
    const players = get().players.filter((p) => !p.fixed);
    const currentPlayer = get().currentPlayer;
    set((state) => {
      if (players.length === 1) {
        return {
          ...state,
          currentPlayer: players[0],
          isLastPlayer: true,
          isRoundComp: false,
        };
      }
      if (!currentPlayer || state.isLastPlayer) {
        // もしソート後だった場合、isLastPlayerなのにカレントプレイヤーが最後にいない可能性があるため一律0番目のプレイヤーを返す
        state.currentPlayer = players[0];
        return {
          ...state,
          currentPlayer: players[0],
          isLastPlayer,
          isRoundComp: false,
        };
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
    set((state) => {
      let isRoundComp = false;
      if (get().isLastPlayer) {
        isRoundComp = true;
      }
      return {
        ...state,
        players: state.players.map((p) =>
          p.name === player.name ? { ...player, role } : p,
        ),
        isRoundComp,
      };
    }),
  checkPlayersAndFixRole: () => {
    const roles = get().roles;
    const players = get().players.map((player) => {
      if (player.fixed || !player.role) {
        return player; // 既に確定している場合はスキップ
      }
      if (player.role?.name === "スキップ") {
        return player; // スキップの場合はスキップ
      }
      const otherPlayers = get().players.filter((p) => p.name !== player.name);
      const assignedRoles = otherPlayers.map((p) => p.role);

      if (assignedRoles.indexOf(player.role) >= 0) {
        return player; // 使用可能な役職がない場合はスキップ
      }
      roles.forEach((role) => {
        if (role.name === player.role?.name) {
          role.fixed = true;
        }
      });
      return { ...player, fixed: true }; // 他の人に割り振られていない役職があれば確定
    });
    const boardRoles = get().replaceFixedRoles();
    set((state) => {
      return {
        ...state,
        players,
        roles,
        boardRoles,
      };
    });
    const finish = get().players.filter((p) => !p.fixed).length === 0;
    return finish;
  },
  movePlayer: (player, moveCount) => {
    const position = (player.position + moveCount) % 16;
    const newPlayer = { ...player, position };
    set((state) => ({
      ...state,
      players: state.players.map((p) =>
        p.name === player.name ? newPlayer : p,
      ),
    }));
    return newPlayer;
  },
  setSelectedTrump: (player, selectedTrumpValue) =>
    set((state) => {
      const currentPlayer = get().currentPlayer;
      if (currentPlayer.name !== player.name) {
        return state;
      }
      return {
        ...state,
        players: state.players.map((p) =>
          p.name === player.name ? { ...player, selectedTrumpValue } : p,
        ),
      };
    }),
  useSkip: (player) => {
    const currentPlayer = get().currentPlayer;
    if (currentPlayer.name !== player.name) {
      return player;
    }
    const newPlayer = { ...player, usedSkip: true };
    set((state) => ({
      ...state,
      players: state.players.map((p) =>
        p.name === player.name ? newPlayer : p,
      ),
    }));
    return newPlayer;
  },
});
