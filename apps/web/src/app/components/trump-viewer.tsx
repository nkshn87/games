"use client";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import { useBoundStore } from "../store";
import { Trump } from "../types";
import clsx from "clsx";
import { Box, Flex } from "@repo/ui";

interface TrumpViewerProps {}

export const TrumpViewer: FC<TrumpViewerProps> = () => {
  const { trumps, shuffleTrumps, gameState } = useBoundStore();

  useEffect(() => {
    shuffleTrumps();
  }, []);

  return (
    <Box>
      {(gameState === "orderPhase" || gameState === "sugorokuPhase") && (
        <TrumpList trumpPropsList={trumps} />
      )}
    </Box>
  );
};

interface TrumpListProps {
  trumpPropsList: TrumpProps[];
}

const TrumpList: FC<TrumpListProps> = (props) => {
  const { trumpPropsList } = props;
  return (
    <Flex gap="3" wrap="wrap" justify="end">
      {trumpPropsList.map((trumpProps) => (
        <TrumpCard key={trumpProps.value} {...trumpProps} />
      ))}
    </Flex>
  );
};

type TrumpProps = Trump;
const TrumpCard: FC<TrumpProps> = (trump) => {
  const BACK_IMAGE_PATH = "/trump_back.png";
  const { selectedTrump, selectTrump, isDisabled } = useBoundStore();
  const onClick = () => {
    if (isDisabled || trump.isOpened) return;
    // 選択して
    selectTrump(trump);
  };
  return (
    <Box
      onClick={() => onClick()}
      style={{ cursor: "pointer" }}
      className={clsx(
        "border-4 rounded-md",
        trump.value == selectedTrump?.value
          ? "border-blue-200"
          : "border-white",
      )}
    >
      {trump.isOpened ? (
        <div className="relative w-[80px] h-[126px] lg:w-[100px] lg:h-[156px] bg-white">
          <Image
            src={trump.frontImagePath}
            alt={trump.value.toString()}
            fill
            sizes="100px"
            style={{ objectFit: "contain" }}
          />
        </div>
      ) : (
        <div className="relative w-[80px] h-[126px] lg:w-[100px] lg:h-[156px] bg-white">
          <Image
            src={BACK_IMAGE_PATH}
            alt={trump.value.toString()}
            fill
            sizes="100px"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
    </Box>
  );
};
