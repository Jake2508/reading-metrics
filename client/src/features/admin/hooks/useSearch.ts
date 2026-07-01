import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: ["search", query, limit],
    queryFn: () => api.search.query(query, limit),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}
