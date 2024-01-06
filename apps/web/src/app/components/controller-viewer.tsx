"use client";
import React, { FC } from "react";
import { useBoundStore, skipRole } from "../store";
import { GameStateEnum } from "../types";

interface ControllerViewerProps {}
export const ControllerViewer: FC<ControllerViewerProps> = ({}) => {
  const { gameState, isRoundComp, isLastPlayer, currentPlayer } =
    useBoundStore();
  return (
    <div className="flex gap-3">
      <p>isRoundComp: {String(isRoundComp)}</p>
      <p>isLastPlayer: {String(isLastPlayer)}</p>
      {gameState === GameStateEnum.inputPhase && (
        <div>
          <StartGameButton />
        </div>
      )}
      {gameState === GameStateEnum.orderPhase && (
        <div className="flex gap-3">
          {isRoundComp ? <StartSugorokuButton /> : <NextButtonOnOrder />}
        </div>
      )}
      {gameState === GameStateEnum.sugorokuPhase && (
        <div className="flex gap-3">
          {isRoundComp ? (
            <NextRoundButton />
          ) : (
            <>
              <NextButtonOnPlay />
              {!currentPlayer.usedSkip && <SkipButton />}
            </>
          )}
        </div>
      )}
      {gameState === GameStateEnum.gameCompletionPhase && (
        <div>
          <NextButtonOnPlay />
        </div>
      )}
    </div>
  );
};

const StartGameButton = () => {
  const { setGameState } = useBoundStore();
  return (
    <button
      onClick={() => {
        setGameState(GameStateEnum.orderPhase);
      }}
    >
      ゲームスタート!
    </button>
  );
};
const StartSugorokuButton = () => {
  const { setGameState, nextPlayer, sortPlayers, allClose } = useBoundStore();
  return (
    <button
      onClick={async () => {
        console.log("sortPlayers");
        allClose();
        setGameState(GameStateEnum.sugorokuPhase);
        await sortPlayers();
        nextPlayer();
      }}
    >
      すごろくスタート!
    </button>
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
    <button
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
    </button>
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
    <button
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
    </button>
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
    <button
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
    </button>
  );
};

const NextRoundButton = () => {
  const { roles, nextPlayer, allClose, checkPlayersAndFixRole, setGameState } =
    useBoundStore();
  return (
    <button
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
    </button>
  );
};
