"use client";
import React, { FC, useEffect } from "react";
import { GameStateEnum, Player } from "../types";
import { useBoundStore } from "../store";

import clsx from "clsx";
import { calculateOuterNumbers } from "./utils";
import { Box, Flex, Grid, Text } from "@repo/ui";

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
    <Grid columns={String(boardSize)} rows={String(boardSize)} gap="3">
      {(gameState === GameStateEnum.sugorokuPhase ||
        gameState === GameStateEnum.gameCompletionPhase) &&
        squares.map((square) => (
          <Box
            key={square}
            className={`relative rounded-lg ${
              square !== centerSquare &&
              "w-full  max-h-20 border-2 border-gray-300 "
            }`}
            style={{
              gridColumn:
                square === centerSquare ? `span ${boardSize - 2}` : "span 1",
              gridRow:
                square === centerSquare ? `span ${boardSize - 2}` : "span 1",
              // background: square !== centerSquare ? "linear-gradient(to bottom right, #F0F0F0, var(--indigo-a3))" : undefined,
            }}
          >
            <Flex align="start" justify="center" height="100%">
              <Flex
                gap="3"
                justify="center"
                className="h-full absolute top-0 left-0 z-30"
                wrap="wrap"
              >
                {players.map((player) => {
                  const playerSquare = outerSquares[player.position];
                  if (playerSquare === square) {
                    return <PlayerPiece key={player.name} player={player} />;
                  }
                })}
              </Flex>
              <Flex className="h-full w-full pl-3" align="center" gap="2">
                <Box className="">
                  <Text size="1">
                    {square !== centerSquare
                      ? `${outerSquares.indexOf(square) + 1}:`
                      : null}
                  </Text>
                </Box>
                <Box className="w-full">
                  <Text size="1">
                    {square !== 7 && boardRoles[square - 1] && (
                      <div>{boardRoles[square - 1].name}</div>
                    )}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        ))}
    </Grid>
  );
};

interface PlayerPieceProps {
  player: Player;
}

const PlayerPiece: FC<PlayerPieceProps> = (props) => {
  const { player } = props;

  const playerPieceClasses = clsx(
    "w-7 h-7",
    "flex items-center justify-center",
    "text-xs rounded-full",
    getColorClass(player.color),
  );

  return <Box className={playerPieceClasses}>{player.name.slice(0, 3)}</Box>;
};

export const getColorClass = (color: string) => {
  switch (color) {
    case "red":
      return "bg-red-400";
    case "green":
      return "bg-green-400";
    case "blue":
      return "bg-blue-400";
    case "orange":
      return "bg-orange-400";
  }
};
