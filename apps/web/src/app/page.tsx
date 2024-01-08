import {
  BoardViewer,
  ControllerViewer,
  MessageViewer,
  PlayerViewer,
  TrumpViewer,
} from "./components";
import React from "react";
import { Flex, Grid } from "@repo/ui";

export default function Page(): JSX.Element {
  return (
    <>
      <Flex justify="center" className="pt-8 md:pt-20 px-3 h-screen">
        <Grid
          rows="3"
          gap="6"
          style={{ gridTemplateRows: "6fr 2fr 6fr" }}
          className=" w-full max-w-6xl"
        >
          <BoardViewer />
          <MessageViewer />
          <Grid
            columns="2"
            style={{ gridTemplateColumns: "2fr 5fr", height: "100%" }}
          >
            <PlayerViewer />
            <Grid rows="2" gap="6" style={{ gridTemplateRows: "1fr 5fr" }}>
              <ControllerViewer />
              <TrumpViewer />
            </Grid>
          </Grid>
        </Grid>
      </Flex>
    </>
  );
}
