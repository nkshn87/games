"use client";
import React, { FC, useEffect } from "react";
import { useBoundStore } from "../store";
import { Box, Callout, Flex } from "@repo/ui";
import { getColorClass } from ".";

interface MessageViewerProps {}

export const MessageViewer: FC<MessageViewerProps> = () => {
  const { message, setMessage, currentPlayer } = useBoundStore();
  useEffect(() => {
    setMessage({
      texts: [
        "プレイヤーを追加してください。",
        `完了したら「ゲームスタート！」を押してください。`,
      ],
      to: currentPlayer,
    });
  }, []);
  if (!message || !message?.texts) return null;
  return (
    <Callout.Root variant="soft" size="3">
      <Flex height="100%" gap="6">
        {!!message?.to?.name && (
          <Flex align="center" gap="3" height="100%">
            <Box
              className={`${
                message.to.color && getColorClass(message.to.color)
              } w-7 h-7 rounded-full`}
            />
            {message?.to.name} さん !
          </Flex>
        )}
        <Flex direction="column" justify="center" height="100%" gap="3">
          {message?.texts.map((text, i) => (
            <Callout.Text key={i}>{text}</Callout.Text>
          ))}
        </Flex>
      </Flex>
    </Callout.Root>
  );
};
