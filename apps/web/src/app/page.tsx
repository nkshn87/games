import {
  BoardViewer,
  ControllerViewer,
  MessageViewer,
  PlayerViewer,
  TrumpViewer,
} from "./components";
import React from "react";
import { Box, Flex, Grid, Theme } from "@repo/ui";

export default function Page(): JSX.Element {
  return (
    <Theme>
      <Flex justify="center">
        <Grid
          rows="3"
          p="7"
          gap="3"
          style={{ gridTemplateRows: "12fr 2fr 6fr" }}
          className="h-screen w-full max-w-6xl"
        >
          <BoardViewer />
          <MessageViewer />
          <Box>
            <Grid
              columns="2"
              style={{ gridTemplateColumns: "5fr 2fr", height: "100%" }}
            >
              <Grid rows="2" gap="3" style={{ gridTemplateRows: "auto 2fr" }}>
                <TrumpViewer />
                <ControllerViewer />
              </Grid>
              <PlayerViewer />
            </Grid>
          </Box>
        </Grid>
      </Flex>
    </Theme>
  );
}

/**
 * 操作者はひとり
 *
 * 役職入力フェーズ
 *  役職を入力すると、入力欄の下にその役職カード一覧が表示される
 *  役職のプライオリティを決める
 * プレイヤー入力フェーズ
 *  プレイヤーの名前を全員分入力
 *  プレイヤーの名前を入力すると、入力欄の下にそのプレイヤーカード一覧が表示される
 *  全員分入力したら、スタートボタンを押す
 * トランプを選択するフェーズ
 *  上から順に、トランプを選択する
 *  トランプを選択すると、そのトランプが選択されたことを示すプレイヤー名のマークがつく
 *  トランプを選択したら、次のプレイヤーに移る
 *  全員分選択したら、オープンボタンを押す
 * 並び替えフェーズ
 *  トランプがオープンされる
 *  数字が大きい順にプレイヤー一覧を並び替える
 * すごろく開始フェーズ
 *  すごろくを開始するボタンを押す
 *  すごろくボードが表示される
 *
 *  順番にカードをめくる。カードは開いたまま。残りのカードから引く
 *
 * 順番の管理をどうするか。
 *
 */
