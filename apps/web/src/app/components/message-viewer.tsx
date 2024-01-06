"use client";
import React, { FC } from "react";
import { useBoundStore } from "../store";

interface MessageViewerProps {}

export const MessageViewer: FC<MessageViewerProps> = ({}) => {
  const { currentPlayer } = useBoundStore();
  return <div>{currentPlayer.name}</div>;
};
