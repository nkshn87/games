"use client";
import React, { FC } from "react";
import { useBoundStore } from "../store";
import { Player } from "../types";

interface PlayerViewerProps {}

export const PlayerViewer: FC<PlayerViewerProps> = ({}) => {
  const { players } = useBoundStore();
  return (
    <div className="w-40 p-3">
      <PlayerList playerPropsList={players} />
    </div>
  );
};

interface PlayerListProps {
  playerPropsList: PlayerProps[];
}

const PlayerList: FC<PlayerListProps> = (props) => {
  const { playerPropsList } = props;
  return (
    <div className="gap-3">
      {playerPropsList.map((playerProps) => (
        <Player key={playerProps.name} {...playerProps} />
      ))}
    </div>
  );
};

// Player型のうち、nameだけ必須で、他は任意のプロパティとする
type PlayerProps = Pick<Player, "name"> & Partial<Omit<Player, "name">>;

const Player: FC<PlayerProps> = (props) => {
  const { name, role, fixed, selectedTrumpValue } = props;
  return (
    <>
      <div className="flex gap-2 p-2 rounded-xl ">
        <div>{selectedTrumpValue}</div>
        <div>{name}</div>
        <div>{role?.name}</div>
        {fixed && <div>確</div>}
      </div>
    </>
  );
};
