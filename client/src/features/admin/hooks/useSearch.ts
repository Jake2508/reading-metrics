import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.search.query(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}
