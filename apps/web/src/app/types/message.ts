import { Player } from ".";

export type Message = {
  texts: string[];
  to: Player | null;
};
