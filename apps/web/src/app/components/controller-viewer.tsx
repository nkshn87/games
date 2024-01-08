"use client";
import React, { FC } from "react";
import { useBoundStore, skipRole } from "../store";
import { Box, Button } from "@repo/ui";
import { Flex } from "@repo/ui";

interface ControllerViewerProps {}
export const ControllerViewer: FC<ControllerViewerProps> = () => {
  const { gameState, isRoundComp, currentPlayer } = useBoundStore();

  return (
    <Box className="w-full">
      <Flex gap="3" className="w-full" justify="center">
        {gameState === "inputPhase" && <StartGameButton />}
        {gameState === "orderPhase" &&
          (isRoundComp ? <StartSugorokuButton /> : <NextButtonOnOrder />)}
        {gameState === "sugorokuPhase" &&
          (isRoundComp ? (
            <NextRoundButton />
          ) : (
            <Flex gap="6" className="w-full" justify="center">
              <NextButtonOnPlay />
              {!currentPlayer?.usedSkip && <SkipButton />}
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

const StartGameButton = () => {
  const { setGameState, setMessage, players, setCurrentPlayer } =
    useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={() => {
        if (players.length < 2)
          return alert("プレイヤーを2人以上登録してください。");
        setGameState("orderPhase");
        setCurrentPlayer(players[0]);
        setMessage({
          texts: [
            "プレイヤー順を決めます。",
            `お好きなカードを選んで「決定」ボタンを押してください！`,
          ],
          to: players[0],
        });
      }}
    >
      ゲームスタート!
    </Button>
  );
};
const StartSugorokuButton = () => {
  const {
    setGameState,
    shuffleTrumps,
    nextPlayer,
    sortPlayers,
    allClose,
    setMessage,
  } = useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={async () => {
        console.log("sortPlayers");
        allClose();
        setGameState("sugorokuPhase");
        await sortPlayers();
        const player = nextPlayer();
        shuffleTrumps();
        setMessage({
          texts: [
            `カードを選択し「カード確定」ボタンを押してください。`,
            "記載の数字だけコマを進めます。",
          ],
          to: player,
        });
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
    setMessage,
  } = useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={() => {
        if (!currentPlayer) return;
        if (!selectedTrump) return alert("お好きなカードを選択してください！");
        // ひっくり返して
        flipTrump(selectedTrump);
        // プレイヤーにカードの数字をセット（順番を決める）
        setSelectedTrump(currentPlayer, selectedTrump?.value);
        clearSelectedTrump();
        if (!isLastPlayer) {
          // 最後のプレーヤーじゃないなら次のプレーヤーへ
          const player = nextPlayer();
          setMessage({
            texts: [
              "プレイヤー順を決めます。",
              `お好きなカードを選んで「決定」ボタンを押してください！`,
            ],
            to: player,
          });
        } else {
          setMessage({
            texts: [
              "数字の大きい順にプレイヤーを並び替え、すごろくゲームを開始します。",
              "「すごろくスタート!」ボタンを押してください。",
            ],
            to: null,
          });
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
    setMessage,
  } = useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={() => {
        if (!currentPlayer) return;
        if (!selectedTrump) return alert("お好きなカードを選択してください！");
        // ひっくり返して
        flipTrump(selectedTrump);
        // プレイヤーにカードの数字をセット（セットする意味は特にないが、ユーザアクションの確定を意味する）
        setSelectedTrump(currentPlayer, selectedTrump?.value);
        // カードの数字分進める
        const newPlayer = movePlayer(currentPlayer, selectedTrump.value);
        // 進めた先のマスの役割をセットする（確定はしていない）
        const newRole = getNewRole(newPlayer);
        assignRole(newPlayer, newRole);
        if (!isLastPlayer) {
          // 最後のプレーヤーのときは、結果を眺められるよう、次のプレーヤーには移動しない
          const player = nextPlayer();
          setMessage({
            texts: [
              `任意のカードを選択し「カード確定」ボタンを押してください。`,
              "カードを確認しコマを進めます。",
            ],
            to: player,
          });
        } else {
          setMessage({
            texts: [
              "🐍 一巡しました！",
              "「次のラウンドへ」ボタンを押してください。",
            ],
            to: null,
          });
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
  } = useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={() => {
        if (!currentPlayer) return;
        const newPlayer = useSkip(currentPlayer);
        assignRole(newPlayer, skipRole);
        if (!isLastPlayer) {
          // 最後のプレーヤーのときは、結果を眺められるよう、次のプレーヤーには移動しない
          nextPlayer();
        }
        clearSelectedTrump();
      }}
    >
      スキップ ( 1回だけ👺 )
    </Button>
  );
};

const NextRoundButton = () => {
  const {
    roles,
    nextPlayer,
    allClose,
    checkPlayersAndFixRole,
    setGameState,
    shuffleTrumps,
    setMessage,
  } = useBoundStore();
  return (
    <Button
      className="w-32 md:w-48 lg:w-80"
      size="3"
      onClick={() => {
        const finish = checkPlayersAndFixRole();
        console.log("roles", roles);
        if (finish) {
          setGameState("gameCompletionPhase");
          setMessage({
            texts: [`💯 全員の役職が確定しました！`, `おつかれさまでした！`],
            to: null,
          });
          return;
        } else {
          const player = nextPlayer();
          allClose();
          shuffleTrumps();
          setMessage({
            texts: [
              `お好きなカードを選んで「カード確定」ボタンを押してください。`,
              "カードを確認しコマを進めます。",
            ],
            to: player,
          });
          return;
        }
      }}
    >
      次のラウンドへ
    </Button>
  );
};
