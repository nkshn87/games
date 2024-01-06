import {
  BoardViewer,
  ControllerViewer,
  MessageViewer,
  PlayerViewer,
  RoleViewer,
  TrumpViewer,
} from "./components";
import React from "react";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center min-h-screen p-24">
      <MessageViewer />
      <div className="flex gap-3">
        <div>
          <TrumpViewer />
          <ControllerViewer />
        </div>
        <div className="flex gap-3">
          <PlayerViewer />
          {/* <RoleViewer /> */}
        </div>
      </div>
      <BoardViewer />
    </main>
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
