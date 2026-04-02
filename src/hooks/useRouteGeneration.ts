import { useMutation } from "@tanstack/react-query";
import { generateRoute, sendChatMessage } from "@/api/baramiz";

export function useGenerateRouteMutation() {
  return useMutation({
    mutationFn: generateRoute,
  });
}

export function useChatMutation() {
  return useMutation({
    mutationFn: sendChatMessage,
  });
}
