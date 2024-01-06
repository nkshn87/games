"use client";
import React, { FC } from "react";
import { useBoundStore } from "../store";
import { Player } from "../types";
import { Box, Card, Flex, Table, Text } from "@repo/ui";
import { getColorClass } from ".";

interface PlayerViewerProps {}

export const PlayerViewer: FC<PlayerViewerProps> = ({}) => {
  const { players } = useBoundStore();
  return (
    <Box width="100%">
      <PlayerList playerPropsList={players} />
    </Box>
  );
};

interface PlayerListProps {
  playerPropsList: PlayerProps[];
}

const PlayerList: FC<PlayerListProps> = (props) => {
  const { playerPropsList } = props;
  return (
    <Table.Root style={{ width: "100%" }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <Text></Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text>名前</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text>役職</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text>確定</Text>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {playerPropsList.map((playerProps) => (
          <Player key={playerProps.name} {...playerProps} />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

// Player型のうち、nameだけ必須で、他は任意のプロパティとする
type PlayerProps = Pick<Player, "name"> & Partial<Omit<Player, "name">>;

const Player: FC<PlayerProps> = (props) => {
  const { name, role, fixed, color } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <Box
          className={`${color && getColorClass(color)} w-7 h-7 rounded-full`}
        />
      </Table.Cell>
      <Table.RowHeaderCell>
        <Text>{name}</Text>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Text>{role?.name}</Text>
      </Table.Cell>
      <Table.Cell>{fixed && <Text>確</Text>}</Table.Cell>
    </Table.Row>
  );
};
