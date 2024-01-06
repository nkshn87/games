export enum GameStateEnum {
  inputPhase = "inputPhase",
  orderPhase = "orderPhase",
  sugorokuPhase = "sugorokuPhase",
  gameCompletionPhase = "gameCompletionPhase",
}
export type GameStateEnumKeys = keyof typeof GameStateEnum;
export type GameStateEnumValues = (typeof GameStateEnum)[GameStateEnumKeys];
export type GameStateEnumType = Record<GameStateEnumKeys, GameStateEnumValues>;
