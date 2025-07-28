import type { MRT_ColumnDef, MRT_FilterFn } from 'material-react-table';
import type { Client } from '../types/clients';

export const STATUS_OPTIONS   = ['active', 'prospect', 'inactive'] as const;
export const INDUSTRY_OPTIONS = ['SaaS', 'Finance', 'Retail', 'Healthcare'] as const;


export const selectEquals: MRT_FilterFn<Client> = (row, columnId, filterValues: string[]) => {
  if (!filterValues?.length) return true;                      
  return filterValues.includes(row.getValue<string>(columnId)); 
};


export const CLIENT_COLUMNS: MRT_ColumnDef<Client>[] = [
  { accessorKey: 'name',  header: 'Name',  size: 200 },
  { accessorKey: 'email', header: 'Email', size: 250 },

  {
    accessorKey: 'status',
    header:      'Status',
    size:        140,
    filterVariant:        'multi-select',
    filterFn:             selectEquals,
    filterSelectOptions:  [...STATUS_OPTIONS],
  },
  {
    accessorKey: 'industry',
    header:      'Industry',
    size:        160,
    filterVariant: 'multi-select',
    filterFn:      selectEquals,
  },
  {
    accessorKey: 'monthlySpend',
    header: 'MRR',
    size:   100,
    Cell:   ({ cell }) => `$${cell.getValue<number>()}`,
  },
];
