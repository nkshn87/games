"use client";
import React, { FC, useEffect } from "react";
import { GameStateEnum, Player } from "../types";
import { useBoundStore } from "../store";

import clsx from "clsx";
import { calculateOuterNumbers } from "./utils";

interface BoardViewerProps {}

export const BoardViewer: FC<BoardViewerProps> = ({}) => {
  const {
    players,
    boardSize,
    squares,
    boardRoles,
    shuffleBoardRoles,
    gameState,
  } = useBoundStore();
  const centerSquare = boardSize + 2;

  const outerSquares = calculateOuterNumbers(boardSize);

  useEffect(() => {
    shuffleBoardRoles();
  }, []);

  return (
    <div className={`grid ${getGridCol(boardSize)} gap-2`}>
      {(gameState === GameStateEnum.sugorokuPhase ||
        gameState === GameStateEnum.gameCompletionPhase) &&
        squares.map((square) => (
          <div
            key={square}
            className={`rounded-lg flex gap-x-12 gap-y-3 flex-wrap items-center justify-center ${
              square === centerSquare
                ? `${getSpanStart(boardSize)}`
                : "w-48 h-24 border border-gray-500"
            }`}
          >
            {players.map((player) => {
              const playerSquare = outerSquares[player.position];
              if (playerSquare === square) {
                return <PlayerPiece key={player.name} player={player} />;
              }
            })}
            {outerSquares.indexOf(square) + 1 || null}
            {square !== 7 && boardRoles[square - 1] && (
              <div>{boardRoles[square - 1].name}</div>
            )}
          </div>
        ))}
    </div>
  );
};

interface PlayerPieceProps {
  player: Player;
}

const PlayerPiece: FC<PlayerPieceProps> = (props) => {
  const { player } = props;
  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "green":
        return "bg-green-500";
      case "blue":
        return "bg-blue-500";
      case "orange":
        return "bg-orange-500";
    }
  };

  const playerPieceClasses = clsx(
    "w-8 h-8",
    "flex items-center justify-center",
    " rounded-full",
    getColorClass(player.color),
  );

  return <div className={playerPieceClasses}>{player.name.slice(0, 2)}</div>;
};

const getGridCol = (size: number) => {
  switch (size) {
    case 4:
      return "grid-cols-4";
    case 5:
      return "grid-cols-5";
    case 6:
      return "grid-cols-6";
    case 7:
      return "grid-cols-7";
  }
};
const getSpanStart = (size: number) => {
  switch (size) {
    case 4:
      return "col-span-2 row-span-2";
    case 5:
      return "col-span-3 row-span-3";
    case 6:
      return "col-span-4 row-span-4";
    case 7:
      return "col-span-5 row-span-5";
  }
};
