import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api/clients';
import type { Client } from '../types/clients';

export type ClientsQueryKey = [
  'clients',
  { globalFilter: string | undefined }
];

const PAGE_SIZE = 10;

export function useInfiniteClients(globalFilter: string | undefined) {
  return useInfiniteQuery({
    queryKey: ['clients', { globalFilter }],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string | number> = {
    _page : pageParam,
    _limit: PAGE_SIZE,
    _sort : 'name',
    _order: 'asc',
  };
  if (globalFilter) {
    // only include q when the user actually searched
    params.q = globalFilter;
  }
      console.log('Fetching page', pageParam, 'via', api.defaults.baseURL + '/clients', 'with params',  {
          _page : pageParam,
          _limit: PAGE_SIZE,
          _sort : 'name',
          _order: 'asc',
          q     : globalFilter ?? '',
        },);
      const res = await api.get<Client[]>('/clients', {
params
      });
      await new Promise((r) => setTimeout(r, 800));
      const total = Number(res.headers['x-total-count'] ?? 0);
      return {
        data : res.data,
        total: total
      };
    },
    initialPageParam: 1,
    // 🔑 stop once last page < PAGE_SIZE
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length < PAGE_SIZE ? undefined : pages.length + 1,
    refetchOnWindowFocus: false,
  });
}

