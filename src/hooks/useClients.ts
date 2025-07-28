import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addClient, updateClient, deleteClient, getAllClients } from '../api/clients';

export function useAllClients() {
  return useQuery({
    queryKey: ['clients', 'all'],
    queryFn: getAllClients,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true, // always refetch when the component mounts
    refetchOnWindowFocus: true, // and when the window/tab regains focus
  });
}

export function useAddClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
