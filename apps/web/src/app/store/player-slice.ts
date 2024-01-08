import { StateCreator } from "zustand";
import { PlayersSlice, State } from "./slice-interfaces";
import { Player } from "../types";

const DEFAULT_PLAYERS: Player[] = [
  // {
  //   name: "isao",
  //   selectedTrumpValue: null,
  //   role: null,
  //   fixed: false,
  //   position: 0,
  //   color: "red",
  //   usedSkip: false,
  // },
  // {
  //   name: "hiroki",
  //   selectedTrumpValue: null,
  //   role: null,
  //   fixed: false,
  //   position: 0,
  //   color: "blue",
  //   usedSkip: false,
  // },
  // {
  //   name: "shuhei",
  //   selectedTrumpValue: null,
  //   role: null,
  //   fixed: false,
  //   position: 0,
  //   color: "green",
  //   usedSkip: false,
  // },
  // {
  //   name: "shun",
  //   selectedTrumpValue: null,
  //   role: null,
  //   fixed: false,
  //   position: 0,
  //   color: "orange",
  //   usedSkip: false,
  // },
];

export const createPlayersSlice: StateCreator<State, [], [], PlayersSlice> = (
  set,
  get,
) => ({
  players: DEFAULT_PLAYERS,
  currentPlayer: null,
  isRoundComp: false,
  isLastPlayer: false,
  colors: ["red", "blue", "green", "orange", "purple", "pink"].sort(
    () => Math.random() - 0.5,
  ),
  setCurrentPlayer: (player) => {
    set((state) => ({
      ...state,
      currentPlayer: player,
    }));
  },
  nextPlayer: () => {
    let nextPlayer = null;
    let isLastPlayer = false;
    const players = get().players.filter((p) => !p.fixed);
    const currentPlayer = get().currentPlayer;
    set((state) => {
      if (players.length === 1) {
        nextPlayer = players[0];
        return {
          ...state,
          currentPlayer: nextPlayer,
          isLastPlayer: true,
          isRoundComp: false,
        };
      }
      if (!currentPlayer || state.isLastPlayer) {
        // もしソート後だった場合、isLastPlayerなのにカレントプレイヤーが最後にいない可能性があるため一律0番目のプレイヤーを返す
        nextPlayer = players[0];
        return {
          ...state,
          currentPlayer: nextPlayer,
          isLastPlayer,
          isRoundComp: false,
        };
      }

      // indexは現在のプレイヤーのインデックス
      const index = players.findIndex((p) => p.name === currentPlayer.name);
      // 次のプレイヤーのインデックスを計算する
      const nextIndex = (index + 1) % players.length;
      nextPlayer = players[nextIndex];
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
    return nextPlayer;
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
  addPlayer: (name) =>
    set((state) => {
      const colors = get().colors;
      const color = colors.pop();
      if (!color) {
        return state;
      }
      if (name === "") {
        alert("名前を入力してください");
        return state;
      }
      if (name.length > 10) {
        alert("名前は10文字以内で入力してください");
        return state;
      }
      const exist = get().players.find((p) => p.name === name);
      if (exist) {
        alert("既に同じ名前のプレイヤーがいます");
        return state;
      }
      const player: Player = {
        name,
        selectedTrumpValue: null,
        role: null,
        fixed: false,
        position: 0,
        color: color,
        usedSkip: false,
      };
      return {
        ...state,
        players: [...state.players, player],
        colors: [...colors],
      };
    }),
  removePlayer: (name) =>
    set((state) => {
      const rmPlayer = state.players.find((p) => p.name === name);
      if (!rmPlayer) {
        alert("プレイヤーが見つかりません");
        return state;
      }
      const newPlayers = state.players.filter((p) => p.name !== name);
      const colors = [...state.colors, rmPlayer.color];
      return { ...state, players: newPlayers, colors };
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
      if (currentPlayer?.name !== player.name) {
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
  useSkip: (player) => {
    const currentPlayer = get().currentPlayer;
    if (currentPlayer?.name !== player.name) {
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
