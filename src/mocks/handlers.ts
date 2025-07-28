import { http, HttpResponse } from 'msw';
import type { Client } from '../types/clients';

/* ------------ tiny in-memory DB ------------ */
let clients: Client[] = [
  { id: 'aaa01', name: 'Ada Lovelace',  email: 'ada@mail.com',   phone: 5550000001,
    createdAt: '2025-01-15', status: 'active',   industry: 'SaaS',
    monthlySpend: 399, lifetimeValue: 4800 },
  { id: 'bbb02', name: 'Grace Hopper', email: 'grace@mail.com', phone: 5550000002,
    createdAt: '2025-02-20', status: 'prospect', industry: 'Finance',
    monthlySpend: 0,   lifetimeValue: 0 },
];

/* helper to parse search params */
const pageInfo = (url: URL) => ({
  page : Number(url.searchParams.get('_page')  ?? 1),
  limit: Number(url.searchParams.get('_limit') ?? 20),
});

/* ---------- handlers (http.*) -------------- */
export const handlers = [
  /* GET /clients  ─────────────── */
  http.get('http://localhost:4000/api/clients', ({ request }) => {
    const { page, limit } = pageInfo(new URL(request.url));
    const start = (page - 1) * limit;
    const slice = clients.slice(start, start + limit);

    return HttpResponse.json(slice, {
      status: 200,
      headers: { 'x-total-count': String(clients.length) },
    });
  }),

  /* POST /clients  ────────────── */
  http.post('http://localhost:4000/api/clients', async ({ request }) => {
    const body = (await request.json()) as Client;
    clients.push(body);
    return HttpResponse.json(body, { status: 201 });
  }),

  /* PUT /clients/:id  ─────────── */
  http.put('http://localhost:4000/api/clients/:id', async ({ params, request }) => {
    const body = (await request.json()) as Client;
    clients = clients.map((c) => (c.id === params.id ? body : c));
    return HttpResponse.json(body);
  }),

  /* DELETE /clients/:id  ──────── */
  http.delete('http://localhost:4000/api/clients/:id', ({ params }) => {
    clients = clients.filter((c) => c.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
