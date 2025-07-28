// src/types/client.ts
export type Client = {
  id:            string;
  name:          string;
  email:         string;
  phone:         number;               // exactly 10 digits (no dashes)
  createdAt:     string;               // YYYY-MM-DD
  status:        'prospect' | 'active' | 'inactive';
  industry:      'SaaS' | 'Finance' | 'Retail' | 'Healthcare';
  monthlySpend:  number;
  lifetimeValue: number;
};

export type PaginationState = {
  pageIndex: number
  pageSize: number
}