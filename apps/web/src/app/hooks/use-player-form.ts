import { useForm } from "react-hook-form";
import { playerInputSchema, PlayerInput } from "../types/player";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBoundStore } from "../store";

export const usePlayerCreateInputForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerInput>({
    resolver: zodResolver(playerInputSchema),
  });
  const { addPlayer, players } = useBoundStore();

  const onSubmit = (data: PlayerInput) => {
    if (players.length >= 4) {
      alert("プレイヤーは4人までです");
      return;
    }
    addPlayer(data.name);
    // inputデータをクリアする
    reset();
  };

  return {
    register,
    onSubmit: handleSubmit(onSubmit),
    errors,
  };
};
