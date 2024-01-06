"use client";
import React, { FC } from "react";
import { useBoundStore } from "../store";
import { Box, Callout, InfoCircledIcon } from "@repo/ui";

interface MessageViewerProps {}

export const MessageViewer: FC<MessageViewerProps> = ({}) => {
  const { currentPlayer } = useBoundStore();
  return (
    <Box height="100%">
      <Callout.Root variant="soft" size="3">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>{currentPlayer.name}</Callout.Text>
      </Callout.Root>
    </Box>
  );
};
