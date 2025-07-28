/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { INITIAL_CLIENTS } from '../constants/client.context.constants';
import type { Client } from '../types/clients';




type Ctx = {
  clients: Client[];
  add(c: Client): void;
  update(c: Client): void;
  remove(id: string): void;
};

export const ClientCtx = createContext<Ctx | null>(null);
export const useClients = () => useContext(ClientCtx)!;


export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

  const add = useCallback((c: Client) => setClients((p) => [...p, c]), []);
  const update = useCallback((c: Client) => {
    setClients((p) => p.map((x) => (x.id === c.id ? c : x)));
  }, []);
  const remove = useCallback((id: string) => {
    setClients((p) => p.filter((x) => x.id !== id));
  }, []);

  return (
    <ClientCtx.Provider value={{ clients, add, update, remove }}>
      {children}
    </ClientCtx.Provider>
  );
}
