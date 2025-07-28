// src/components/ClientDialogs.tsx
// import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import type { TransitionProps } from '@mui/material/transitions';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';

import { clientSchema } from '../schemas/clientSchema';
import { z } from 'zod';
import type { Client } from '../types/clients';

type ClientInput = z.input<typeof clientSchema>;
type ClientForm = z.output<typeof clientSchema>;
export type DialogMode = 'create' | 'edit' | 'delete';

type Props = {
  mode: DialogMode;
  open: boolean;
  initial?: Client;
  onClose(): void;
  existing: Client[];
  onSubmit(values: ClientForm): void;
};

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & { children: React.ReactElement },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="left" ref={ref} {...props} />;
// });

const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  '& .MuiPaper-root': {
    borderRadius: 20,
    padding: theme.spacing(3),
    boxShadow: '0 10px 35px rgba(0,0,0,.25)',
    background:
      theme.palette.mode === 'dark' ? 'rgba(30,30,30,.9)' : 'rgba(255,255,255,.9)',
    backdropFilter: 'blur(10px)',
  },
}));

const actionBtn = {
  transition: 'transform .15s,box-shadow .15s',
  boxShadow: '0 3px 8px rgba(0,0,0,.15)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,.25)',
  },
};

const industries = ['SaaS', 'Finance', 'Retail', 'Healthcare'] as const;
const statuses = ['active', 'prospect', 'inactive'] as const;

export function ClientDialog(props: Props) {
  const { mode, open, initial, onClose, onSubmit } = props;
  const methods = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues:
      mode === 'edit'
        ? initial
        : {
            id: nanoid(5),
            name: '',
            email: '',
            phone: 0,
            industry: 'SaaS',
            status: 'prospect',
            monthlySpend: 0,
            lifetimeValue: 0,
          },
  });

  // Delete confirmation
  if (mode === 'delete') {
    return (
      <GlassDialog
        open={open}
        onClose={onClose}
        // TransitionComponent={Transition}
        TransitionProps={{ timeout: 0 }}
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete <strong>{initial?.name}</strong>?
        </DialogTitle>
        <DialogActions>
          <Button onClick={onClose} sx={actionBtn} aria-label="Cancel deletion">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={actionBtn}
            onClick={() => {
              if (initial) onSubmit(initial);
              onClose();
            }}
            aria-label={`Confirm delete ${initial?.name}`}
          >
            Delete
          </Button>
        </DialogActions>
      </GlassDialog>
    );
  }

  // Create / Edit form
  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors },
  } = methods;

  const statusVal = watch('status');
  const industryVal = watch('industry');

  const prettyLabel: Record<keyof ClientInput, string> = {
    id: 'ID',
    name: 'NAME',
    email: 'EMAIL',
    phone: 'PHONE',
    status: 'STATUS',
    industry: 'INDUSTRY',
    monthlySpend: 'MONTHLY SPEND',
    lifetimeValue: 'LIFETIME VALUE',
    createdAt: 'CREATED AT',
  };

  const fields: (keyof ClientInput)[] = [
    'name',
    'email',
    'phone',
    'status',
    'industry',
    'monthlySpend',
    'lifetimeValue',
  ];

  return (
    <GlassDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // TransitionComponent={Transition}
      TransitionProps={{ timeout: 0 }}
      role="dialog"
      aria-labelledby="client-dialog-title"
    >
      <DialogTitle id="client-dialog-title">
        {mode === 'create' ? 'Create' : 'Edit'} Client
      </DialogTitle>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((vals) => {
            const parsed = clientSchema.parse(vals);

            const emailTaken = props.existing.some(
              (c) => c.id !== parsed.id && c.email === parsed.email,
            );
            const phoneTaken = props.existing.some(
              (c) => c.id !== parsed.id && c.phone === parsed.phone,
            );

            if (emailTaken || phoneTaken) {
              if (emailTaken)
                setError('email', {
                  type: 'duplicate',
                  message: 'E-mail is already registered',
                });
              if (phoneTaken)
                setError('phone', {
                  type: 'duplicate',
                  message: 'Phone Number already registered',
                });
              return;
            }

            onSubmit(parsed);
            onClose();
          })}
        >
          <DialogContent className="space-y-4">
            {fields.map((field) =>
              field === 'industry' ? (
                <TextField
                  key="industry"
                  id="industry-field"
                  label={prettyLabel[field]}
                  select
                  {...register('industry')}
                  value={industryVal}
                  fullWidth
                  error={!!errors.industry}
                  helperText={errors.industry?.message}
                  aria-required="true"
                >
                  {industries.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field === 'status' ? (
                <TextField
                  key="status"
                  id="status-field"
                  label={prettyLabel[field]}
                  select
                  {...register('status')}
                  value={statusVal}
                  fullWidth
                  disabled={mode === 'create'}
                  sx={mode === 'create' ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  aria-required="true"
                >
                  {statuses.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field === 'phone' ? (
                <TextField
                  key="phone"
                  id="phone-field"
                  type="number"
                  label={prettyLabel[field]}
                  {...register('phone', { valueAsNumber: true })}
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  aria-required="true"
                />
              ) : (
                <TextField
                  key={field}
                  id={`${field}-field`}
                  type={field === 'monthlySpend' || field === 'lifetimeValue' ? 'number' : 'text'}
                  label={prettyLabel[field]}
                  {...register(field, {
                    valueAsNumber: field === 'monthlySpend' || field === 'lifetimeValue',
                  })}
                  fullWidth
                  error={!!errors[field]}
                  helperText={errors[field]?.message}
                  aria-required="true"
                />
              ),
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}  aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
               
                background: 'linear-gradient(90deg,#6366f1 0%,#7c3aed 100%)',
              }}
              aria-label={mode === 'create' ? 'Create client' : 'Save client'}
            >
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </GlassDialog>
  );
}
