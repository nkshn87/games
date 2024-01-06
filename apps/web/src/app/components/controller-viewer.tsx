"use client";
import React, { FC } from "react";
import { useBoundStore, skipRole } from "../store";
import { GameStateEnum } from "../types";
import { Button } from "@repo/ui/button";
import { Flex } from "@repo/ui";

interface ControllerViewerProps {}
export const ControllerViewer: FC<ControllerViewerProps> = ({}) => {
  const { gameState, isRoundComp, isLastPlayer, currentPlayer } =
    useBoundStore();
  return (
    <Flex gap="3">
      {gameState === GameStateEnum.inputPhase && (
        <div>
          <StartGameButton />
        </div>
      )}
      {gameState === GameStateEnum.orderPhase && (
        <Flex gap="3">
          {isRoundComp ? <StartSugorokuButton /> : <NextButtonOnOrder />}
        </Flex>
      )}
      {gameState === GameStateEnum.sugorokuPhase && (
        <Flex gap="3">
          {isRoundComp ? (
            <NextRoundButton />
          ) : (
            <>
              <NextButtonOnPlay />
              {!currentPlayer.usedSkip && <SkipButton />}
            </>
          )}
        </Flex>
      )}
      {gameState === GameStateEnum.gameCompletionPhase && (
        <div>
          <NextButtonOnPlay />
        </div>
      )}
    </Flex>
  );
};

const StartGameButton = () => {
  const { setGameState } = useBoundStore();
  return (
    <Button
      onClick={() => {
        setGameState(GameStateEnum.orderPhase);
      }}
    >
      ゲームスタート!
    </Button>
  );
};
const StartSugorokuButton = () => {
  const { setGameState, nextPlayer, sortPlayers, allClose } = useBoundStore();
  return (
    <Button
      onClick={async () => {
        console.log("sortPlayers");
        allClose();
        setGameState(GameStateEnum.sugorokuPhase);
        await sortPlayers();
        nextPlayer();
      }}
    >
      すごろくスタート!
    </Button>
  );
};

const NextButtonOnOrder = () => {
  const {
    setSelectedTrump,
    isLastPlayer,
    currentPlayer,
    selectedTrump,
    nextPlayer,
    clearSelectedTrump,
    flipTrump,
  } = useBoundStore();
  return (
    <Button
      onClick={() => {
        if (!selectedTrump)
          return alert("お好きなトランプを選択してください！");
        // ひっくり返して
        flipTrump(selectedTrump);
        // プレイヤーにトランプの数字をセット（順番を決める）
        setSelectedTrump(currentPlayer, selectedTrump?.value);
        clearSelectedTrump();
        if (!isLastPlayer) {
          // 最後のプレーヤーじゃないなら次のプレーヤーへ
          nextPlayer();
        }
      }}
    >
      決定
    </Button>
  );
};

const NextButtonOnPlay = () => {
  const {
    selectedTrump,
    setSelectedTrump,
    isLastPlayer,
    currentPlayer,
    movePlayer,
    nextPlayer,
    clearSelectedTrump,
    flipTrump,
    assignRole,
    getNewRole,
  } = useBoundStore();
  return (
    <Button
      onClick={() => {
        if (!selectedTrump)
          return alert("お好きなトランプを選択してください！");
        // ひっくり返して
        flipTrump(selectedTrump);
        // プレイヤーにトランプの数字をセット（セットする意味は特にないが、ユーザアクションの確定を意味する）
        setSelectedTrump(currentPlayer, selectedTrump?.value);
        // トランプの数字分進める
        const newPlayer = movePlayer(currentPlayer, selectedTrump.value);
        // 進めた先のマスの役割をセットする（確定はしていない）
        const newRole = getNewRole(newPlayer);
        assignRole(newPlayer, newRole);
        if (!isLastPlayer) {
          // 最後のプレーヤーのときは、結果を眺められるよう、次のプレーヤーには移動しない
          nextPlayer();
        }
        clearSelectedTrump();
      }}
      disabled={selectedTrump ? false : true}
    >
      カード確定
    </Button>
  );
};

const SkipButton = () => {
  const {
    nextPlayer,
    useSkip,
    isLastPlayer,
    clearSelectedTrump,
    assignRole,
    currentPlayer,
    roles,
  } = useBoundStore();
  return (
    <Button
      onClick={() => {
        const newPlayer = useSkip(currentPlayer);
        assignRole(newPlayer, skipRole);
        if (!isLastPlayer) {
          // 最後のプレーヤーのときは、結果を眺められるよう、次のプレーヤーには移動しない
          nextPlayer();
        }
        clearSelectedTrump();
      }}
    >
      スキップ
    </Button>
  );
};

const NextRoundButton = () => {
  const { roles, nextPlayer, allClose, checkPlayersAndFixRole, setGameState } =
    useBoundStore();
  return (
    <Button
      onClick={() => {
        const finish = checkPlayersAndFixRole();
        console.log("roles", roles);
        if (finish) {
          setGameState(GameStateEnum.gameCompletionPhase);
          return;
        }
        nextPlayer();
        allClose();
      }}
    >
      次のラウンドへ
    </Button>
  );
};
