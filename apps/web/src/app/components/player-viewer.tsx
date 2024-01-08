"use client";
import React, { FC } from "react";
import { useBoundStore } from "../store";
import { GameState, Player } from "../types";
import {
  Box,
  Table,
  Text,
  TextField,
  PaperPlaneIcon,
  Flex,
  Button,
} from "@repo/ui";
import { getColorClass } from ".";
import { usePlayerCreateInputForm } from "../hooks/use-player-form";

interface PlayerViewerProps {}

export const PlayerViewer: FC<PlayerViewerProps> = () => {
  const { players, currentPlayer, gameState } = useBoundStore();
  return (
    <Flex width="100%" direction="column" gap="5">
      {gameState === "inputPhase" && <PlayerForm />}
      <PlayerList players={players} currentPlayer={currentPlayer} />
    </Flex>
  );
};

interface PlayerFormProps {}

const PlayerForm: FC<PlayerFormProps> = () => {
  const { register, onSubmit } = usePlayerCreateInputForm();

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="プレイヤー名" {...register("name")} />
          <TextField.Slot style={{ padding: 0 }}>
            <Button>追加</Button>
          </TextField.Slot>
        </TextField.Root>
      </form>
    </Box>
  );
};

interface PlayerListProps {
  players: Player[];
  currentPlayer: Player | null;
}

const PlayerList: FC<PlayerListProps> = (props) => {
  const { players, currentPlayer } = props;
  const { gameState, removePlayer } = useBoundStore();
  if (players.length === 0) return null;
  return (
    <Table.Root style={{ width: "100%" }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text>名前</Text>
          </Table.ColumnHeaderCell>
          {gameState === "orderPhase" && (
            <Table.ColumnHeaderCell>
              <Text>数字</Text>
            </Table.ColumnHeaderCell>
          )}
          {gameState === "inputPhase" && (
            <Table.ColumnHeaderCell>
              <Text>アクション</Text>
            </Table.ColumnHeaderCell>
          )}
          {(gameState === "sugorokuPhase" ||
            gameState === "gameCompletionPhase") && (
            <>
              <Table.ColumnHeaderCell>
                <Text>役職</Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Text>確定</Text>
              </Table.ColumnHeaderCell>
            </>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {players.map((player) => (
          <PlayerRow
            key={player.name}
            {...player}
            isCurrentPlayer={player.name == currentPlayer?.name}
            gameState={gameState}
            removePlayer={removePlayer}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

// Player型のうち、nameだけ必須で、他は任意のプロパティとする
type PlayerProps = Pick<Player, "name"> &
  Partial<Omit<Player, "name">> & {
    isCurrentPlayer: boolean;
    gameState: GameState;
    removePlayer: (name: string) => void;
  };

const PlayerRow: FC<PlayerProps> = (props) => {
  const {
    name,
    role,
    fixed,
    selectedTrumpValue,
    color,
    isCurrentPlayer,
    gameState,
    removePlayer,
  } = props;
  return (
    <Table.Row>
      <Table.Cell>
        {isCurrentPlayer && (
          <Flex align="center" height="100%">
            <PaperPlaneIcon className="w-5 h-5 text-blue-400" />
          </Flex>
        )}
      </Table.Cell>
      <Table.Cell>
        <Box
          className={`${color && getColorClass(color)} w-7 h-7 rounded-full`}
        />
      </Table.Cell>
      <Table.RowHeaderCell>
        <Text>{name}</Text>
      </Table.RowHeaderCell>
      {gameState === "orderPhase" && (
        <Table.RowHeaderCell>
          <Text>{selectedTrumpValue}</Text>
        </Table.RowHeaderCell>
      )}
      {gameState === "inputPhase" && (
        <Table.ColumnHeaderCell>
          <Button onClick={() => removePlayer(name)}>削除</Button>
        </Table.ColumnHeaderCell>
      )}
      {(gameState === "sugorokuPhase" ||
        gameState === "gameCompletionPhase") && (
        <>
          <Table.Cell>
            <Text>{role?.name}</Text>
          </Table.Cell>
          <Table.Cell>{fixed && <Text>確</Text>}</Table.Cell>
        </>
      )}
    </Table.Row>
  );
};
