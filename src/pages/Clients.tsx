import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { UIEvent } from 'react';
import { MaterialReactTable, type MRT_RowVirtualizer } from 'material-react-table';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { useInfiniteClients } from '../hooks/useInfiniteClients';
import {
  useAddClient,
  useAllClients,
  useDeleteClient,
  useUpdateClient,
} from '../hooks/useClients';
import { CLIENT_COLUMNS } from '../constants/clients.constants';
import { ClientDialog } from '../components/ClientDialogs';
import type { ClientForm } from '../schemas/clientSchema';
import type { Client } from '../types/clients';

export default function ClientsPage() {
  const [params, setParams] = useSearchParams();
  const globalFilter = params.get('query') ?? '';
  const handleGlobalChange = useCallback(
    (v: string) => (v ? setParams({ query: v }) : setParams({})),
    [setParams],
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, error } =
    useInfiniteClients(globalFilter);
  const { data: allClients = [] } = useAllClients();

  const flatData = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const add = useAddClient();
  const update = useUpdateClient();
  const remove = useDeleteClient();

  const [dialog, setDialog] = useState<
    | { mode: 'create'; row?: undefined }
    | { mode: 'edit'; row: Client }
    | { mode: 'delete'; row: Client }
    | null
  >(null);

  const handleSubmit = useCallback(
    async (form: ClientForm) => {
      const dup = allClients.find(
        (c) => c.id !== form.id && (c.email === form.email || c.phone === form.phone),
      );
      if (dup) {
        toast.error(
          `Client with the same ${
            dup.email === form.email ? 'This e-mail' : 'This phone'
          } is already registered.`,
        );
        return;
      }
      if (dialog?.mode === 'create') {
        await add.mutateAsync(form);
        toast.success('New Client Record Added');
      }
      if (dialog?.mode === 'edit') {
        await update.mutateAsync(form);
        toast.success('Client Record Updated');
      }
      if (dialog?.mode === 'delete') {
        await remove.mutateAsync(form.id);
        toast.info('Client Record Deleted');
      }
      setDialog(null);
    },
    [allClients, add, update, remove, dialog],
  );

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtRef = useRef<MRT_RowVirtualizer>(null);

  const lastScrollTop = useRef(0);

  const fetchMoreOnScroll = useCallback(
    (el?: HTMLDivElement | null) => {
      if (!el || !hasNextPage || isFetching) return;
      const { scrollHeight, scrollTop, clientHeight } = el;
      if (scrollTop !== lastScrollTop.current) {
        lastScrollTop.current = scrollTop;
        if (scrollHeight - scrollTop - clientHeight < 400) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage, isFetching],
  );

  useEffect(() => {
    rowVirtRef.current?.scrollToIndex?.(0);
    lastScrollTop.current = 0;
  }, [globalFilter]);

  const renderTopToolbarActions = useCallback(
    () => (
      <TopToolbar
        globalFilter={globalFilter}
        onClear={() => setParams({})}
        onCreate={() => setDialog({ mode: 'create' })}
      />
    ),
    [globalFilter, setParams],
  );

  if (error)
    return (
      <CenterBox>
        <Alert severity="error">
          <Typography variant="h3">
            Couldn’t load clients – {error.message}
            <br />
            Please log in again or contact admin.
          </Typography>
        </Alert>
      </CenterBox>
    );

  if (isLoading)
    return (
      <CenterBox>
        <CircularProgress />
        <Typography variant="h4">Loading…</Typography>
      </CenterBox>
    );

  return (
    <main role="main" aria-labelledby="clients-heading">
      <Typography id="clients-heading" component="h1" variant="h4" gutterBottom>
        Clients
      </Typography>

      <section role="region" aria-labelledby="clients-table-heading">
        <Typography id="clients-table-heading" component="h2" className="sr-only">
          Clients data table
        </Typography>

        <MaterialReactTable
          columns={CLIENT_COLUMNS}
          data={flatData}
          enableRowVirtualization={false}
          manualFiltering
          enablePagination={false}
          muiTableProps={{ 'aria-label': 'Clients data table' }}
          muiTableContainerProps={{
            ref: tableContainerRef,
            role: 'region',
            'aria-labelledby': 'clients-table-heading',
            'aria-busy': isFetching || undefined,
            sx: { maxHeight: '65vh' },
            onScroll: (e: UIEvent<HTMLDivElement>) => fetchMoreOnScroll(e.currentTarget),
          }}
          muiSearchTextFieldProps={{ 'aria-label': 'Search clients' }}
          onGlobalFilterChange={handleGlobalChange}
          state={{
            globalFilter,
            isLoading: isLoading || isFetching,
          }}
          rowVirtualizerInstanceRef={rowVirtRef}
          rowVirtualizerOptions={{ overscan: 4 }}
          enableRowActions
          positionActionsColumn="last"
          displayColumnDefOptions={{
            'mrt-row-actions': { size: 120, header: 'Actions' },
          }}
          renderRowActions={({ row }) => (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <IconButton
                size="large"
                onClick={() => setDialog({ mode: 'edit', row: row.original })}
                aria-label={`Edit client ${row.original.name}`}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => setDialog({ mode: 'delete', row: row.original })}
                aria-label={`Delete client ${row.original.name}`}
              >
                <Delete />
              </IconButton>
            </div>
          )}
          renderTopToolbarCustomActions={renderTopToolbarActions}
          renderBottomToolbarCustomActions={() => (
            <Typography sx={{ p: 1 }}>
              Fetched {flatData.length} of {allClients.length} clients
            </Typography>
          )}
        />

        {dialog && (
          <ClientDialog
            mode={dialog.mode}
            open
            initial={dialog.row}
            existing={allClients}
            onClose={() => setDialog(null)}
            onSubmit={handleSubmit}
          />
        )}
      </section>
    </main>
  );
}

const CenterBox = React.memo(function CenterBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      spacing={3}
      sx={{
        height: '85vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Stack>
  );
});

const TopToolbar = React.memo(function TopToolbar({
  globalFilter,
  onClear,
  onCreate,
}: {
  globalFilter: string;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {globalFilter && (
        <Button size="small" variant="outlined" onClick={onClear}>
          Clear search
        </Button>
      )}
      <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
        Create New Client
      </Button>
    </div>
  );
});
