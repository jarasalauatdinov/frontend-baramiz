import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminPlace,
  deleteAdminPlace,
  getAdminPlaces,
  translateAdminPlace,
  updateAdminPlace,
  type AdminPlaceFilters,
} from "@/api/baramiz";

export function useAdminPlacesQuery(filters: AdminPlaceFilters = {}) {
  return useQuery({
    queryKey: ["admin-places", filters],
    queryFn: () => getAdminPlaces(filters),
  });
}

export function useCreateAdminPlaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminPlace,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-places"] });
      void queryClient.invalidateQueries({ queryKey: ["places"] });
      void queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useUpdateAdminPlaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, payload }: { placeId: string; payload: Parameters<typeof updateAdminPlace>[1] }) =>
      updateAdminPlace(placeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-places"] });
      void queryClient.invalidateQueries({ queryKey: ["places"] });
      void queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteAdminPlaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminPlace,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-places"] });
      void queryClient.invalidateQueries({ queryKey: ["places"] });
      void queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useTranslateAdminPlaceMutation() {
  return useMutation({
    mutationFn: ({ name_uz, description_uz }: { name_uz: string; description_uz: string }) =>
      translateAdminPlace(name_uz, description_uz),
  });
}
