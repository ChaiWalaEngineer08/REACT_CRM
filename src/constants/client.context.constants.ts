
import rawClients from '../../db.json';
import type { Client } from '../types/clients';

const seed = (rawClients as { clients: Client[] }).clients;

export const INITIAL_CLIENTS = seed as Client[];
