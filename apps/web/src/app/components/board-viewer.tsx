"use client";
import React, { FC, useEffect } from "react";
import { Player } from "../types";
import { useBoundStore } from "../store";

import clsx from "clsx";
import { calculateOuterNumbers } from "./utils";
import { Box, Flex, Grid, ScrollArea, Text } from "@repo/ui";
import Image from "next/image";

interface BoardViewerProps {}

export const BoardViewer: FC<BoardViewerProps> = () => {
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
    <>
      {gameState === "sugorokuPhase" || gameState === "gameCompletionPhase" ? (
        <Grid
          columns={String(boardSize)}
          rows={String(boardSize)}
          gap="3"
          className="w-full h-full"
        >
          {squares.map((square) => (
            <Box
              key={square}
              className={`relative rounded-lg ${
                square !== centerSquare &&
                "w-full max-h-20 border-2 border-gray-300 "
              }`}
              style={{
                gridColumn:
                  square === centerSquare ? `span ${boardSize - 2}` : "span 1",
                gridRow:
                  square === centerSquare ? `span ${boardSize - 2}` : "span 1",
                // background: square !== centerSquare ? "linear-gradient(to bottom right, #F0F0F0, var(--indigo-a3))" : undefined,
              }}
            >
              <Box className="h-full w-full">
                <Flex
                  justify="center"
                  className="h-full absolute top-0 left-0 z-30 gap-2 sm:gap-3"
                  wrap="wrap"
                >
                  {players.map((player) => {
                    const playerSquare = outerSquares[player.position];
                    if (playerSquare === square && !player.fixed) {
                      return <PlayerPiece key={player.name} player={player} />;
                    }
                  })}
                </Flex>
                <Flex className="h-full w-full pl-3" align="center" gap="2">
                  {square !== centerSquare ? (
                    <>
                      <Box className="text-base">
                        <Text size="1">{`${
                          outerSquares.indexOf(square) + 1
                        }:`}</Text>
                      </Box>
                      <Text size="1">
                        {square !== 7 && boardRoles[square - 1] && (
                          <div>{boardRoles[square - 1].name}</div>
                        )}
                      </Text>
                    </>
                  ) : (
                    <Box className="text-base w-full">
                      <ScrollArea
                        type="always"
                        scrollbars="vertical"
                        className="w-full h-3/4"
                      >
                        <Flex
                          direction="column"
                          gap="3"
                          className="w-full h-full px-4 md:px-20"
                        >
                          <Text>🐳 役職確定条件</Text>
                          <Text>
                            一巡した時に他の人と役職が被っていないこと
                          </Text>
                        </Flex>
                      </ScrollArea>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>
      ) : (
        <Flex className="w-full h-full" align="center">
          <Box className="w-full h-1/2 bg-gray-300 text-white">
            <Flex align="center" justify="center" className="h-full" gap="3">
              <Image
                alt="trump_back"
                src="/trump_back.png"
                width={35}
                height={50}
              />
              <Text className="text-5xl">トランプ すごろく ゲーム 🎲</Text>
            </Flex>
          </Box>
        </Flex>
      )}
    </>
  );
};

interface PlayerPieceProps {
  player: Player;
}

const PlayerPiece: FC<PlayerPieceProps> = (props) => {
  const { player } = props;

  const playerPieceClasses = clsx(
    "w-5 h-5 sm:w-7 sm:h-7",
    "flex items-center justify-center",
    "text-[12px] sm:text-xxs rounded-full",
    getColorClass(player.color),
  );
  const textLength = includeJa(player.name.slice(0, 3)) ? 1 : 3;
  return (
    <Box className={playerPieceClasses}>{player.name.slice(0, textLength)}</Box>
  );
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
    case "purple":
      return "bg-purple-400";
    case "pink":
      return "bg-pink-400";
    default:
      return "bg-gray-400";
  }
};

function includeJa(text: string) {
  try {
    let gmi = "gmi";
    let regeIncludeHiragana = "^(?=.*[\u3041-\u3096]).*$";
    let regeIncludeKatakana = "^(?=.*[\u30A1-\u30FA]).*$";
    let regeIncludeKanji = "^(?=.*[\u4E00-\u9FFF]).*$";
    let regeHiragana = new RegExp(regeIncludeHiragana, gmi);
    let regeKatakana = new RegExp(regeIncludeKatakana, gmi);
    let regeKanji = new RegExp(regeIncludeKanji, gmi);

    let includeJa = false;
    if (regeHiragana.test(text)) includeJa = true;
    if (regeKatakana.test(text)) includeJa = true;
    if (regeKanji.test(text)) includeJa = true;

    return includeJa;
  } catch (error) {
    alert(error);
  }
}
