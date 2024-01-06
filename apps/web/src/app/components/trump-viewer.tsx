"use client";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import { useBoundStore } from "../store";
import { GameStateEnum, Trump } from "../types";
import clsx from "clsx";

interface TrumpViewerProps {}

export const TrumpViewer: FC<TrumpViewerProps> = ({}) => {
  const { trumps, shuffleTrumps, gameState } = useBoundStore();

  useEffect(() => {
    shuffleTrumps();
  }, []);

  return (
    <div className="">
      {(gameState === GameStateEnum.orderPhase ||
        gameState === GameStateEnum.sugorokuPhase) && (
        <TrumpList trumpPropsList={trumps} />
      )}
    </div>
  );
};

interface TrumpListProps {
  trumpPropsList: TrumpProps[];
}

const TrumpList: FC<TrumpListProps> = (props) => {
  const { trumpPropsList } = props;
  return (
    <div className="flex gap-3">
      {trumpPropsList.map((trumpProps) => (
        <TrumpCard key={trumpProps.value} {...trumpProps} />
      ))}
    </div>
  );
};

type TrumpProps = Trump;
const TrumpCard: FC<TrumpProps> = (trump) => {
  const BACK_IMAGE_PATH = "/trump_back.png";
  const { selectedTrump, selectTrump, flipTrump, disableTrumps, isDisabled } =
    useBoundStore();
  const onClick = () => {
    if (isDisabled || trump.isOpened) return;
    // 選択して
    selectTrump(trump);
  };
  return (
    <>
      <div
        onClick={() => onClick()}
        className={clsx(
          "border-8 rounded-md",
          trump.value == selectedTrump?.value
            ? "border-blue-400"
            : "border-white",
        )}
      >
        {trump.isOpened ? (
          <div className="relative w-[100px] h-[156px] bg-white">
            <Image
              src={trump.frontImagePath}
              alt={trump.value.toString()}
              fill
              sizes="100px"
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className="relative w-[100px] h-[156px] bg-white">
            <Image
              src={BACK_IMAGE_PATH}
              alt={trump.value.toString()}
              fill
              sizes="100px"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
      </div>
    </>
  );
};
