import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography, Grid, useTheme, Alert, Box, CircularProgress } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

import { ChartCard, KpiCard } from '../components/ChartCard';
import { STATUS_COLORS, LINE_GRADIENT_ID } from '../constants/dashboard.constants';
import { useAllClients } from '../hooks/useClients';

export default function Dashboard() {
  const { data: clients = [], isLoading, error } = useAllClients();
  const theme = useTheme();
  const nav = useNavigate();

  /* handlers & memos */
  const goToClients = useCallback(() => nav('/clients'), [nav]);

  const total = useMemo(() => clients.length, [clients]);
  const active = useMemo(
    () => clients.filter((c) => c.status === 'active').length,
    [clients],
  );
  const mrr = useMemo(
    () => clients.reduce((sum, c) => sum + c.monthlySpend, 0),
    [clients],
  );
  const newThisMonth = useMemo(
    () =>
      clients.filter(
        (c) => c.createdAt.slice(0, 7) === new Date().toISOString().slice(0, 7),
      ).length,
    [clients],
  );

  const axisLabelStyle = useMemo(
    () => ({
      fontSize: theme.typography.h6.fontSize,
      fontFamily: theme.typography.h6.fontFamily,
      fontWeight: theme.typography.h6.fontWeight,
      fill: theme.palette.text.secondary,
    }),
    [theme],
  );

  const growthData = useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach((c) => {
      const key = c.createdAt.slice(0, 7);
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [clients]);

  const statusData = useMemo(
    () => [
      { name: 'Active', value: active, color: STATUS_COLORS.active },
      {
        name: 'Prospect',
        value: clients.filter((c) => c.status === 'prospect').length,
        color: STATUS_COLORS.prospect,
      },
      {
        name: 'Inactive',
        value: clients.filter((c) => c.status === 'inactive').length,
        color: STATUS_COLORS.inactive,
      },
    ],
    [clients, active],
  );

  const industryData = useMemo(() => {
    const map: Record<string, number> = {};
    clients.forEach((c) => {
      map[c.industry] = (map[c.industry] || 0) + 1;
    });
    return Object.entries(map).map(([industry, count]) => ({ industry, count }));
  }, [clients]);

  if (error)
    return (
      <Alert severity="error" role="alert" aria-live="assertive" sx={{ mt: 4 }}>
        <Typography component="h2" variant="h3">
          Dashboard could not load – {error.message}. Please log in again or contact your
          administrator
        </Typography>
      </Alert>
    );

  if (isLoading)
    return (
      <Box role="status" aria-live="polite" display="flex" justifyContent="center" mt={8}>
        <CircularProgress aria-label="Loading dashboard data" />
        <Typography variant="h4">Loading…</Typography>
      </Box>
    );

  return (
    <main role="main" aria-labelledby="dashboard-heading" className="space-y-8">
      {/* Page heading */}
      <Typography id="dashboard-heading" variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      {/* KPI cards */}
      <section role="region" aria-labelledby="kpi-heading">
        <Typography id="kpi-heading" component="h2" className="sr-only">
          Key metrics
        </Typography>
        <Grid container spacing={2}>
          <KpiCard
            label="Total Clients"
            value={total}
            onClick={goToClients}
            role="button"
            tabIndex={0}
            aria-label={`Active clients: ${active}. Press Enter or Space to view client list.`}
            onKeyDown={(e) => {
              // Support Enter or Space for keyboard users
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToClients();
              }
            }}
          />
          <KpiCard
            label="Active Clients"
            value={active}
            aria-label={`Active clients: ${active}`}
          />
          <KpiCard
            label="New This Month"
            value={newThisMonth}
            aria-label={`New clients this month: ${newThisMonth}`}
          />
          <KpiCard
            label="MRR"
            value={`$${mrr}`}
            aria-label={`Monthly recurring revenue: $${mrr}`}
          />
        </Grid>
      </section>

      {/* Line chart */}
      <section role="region" aria-labelledby="growth-chart-heading">
        <Typography id="growth-chart-heading" component="h2" className="sr-only">
          New Clients per Month
        </Typography>
        <ChartCard title="New Clients per Month">
          <figure
            role="img"
            aria-label="Line chart showing number of new clients per month"
            style={{ margin: 0 /* remove default figure margin */ }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={growthData}
                margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
              >
                <XAxis dataKey="month">
                  <Label
                    value="Month"
                    position="bottom"
                    offset={-6}
                    style={axisLabelStyle}
                  />
                </XAxis>
                <YAxis allowDecimals={false}>
                  <Label
                    value="New Clients"
                    angle={-90}
                    position="insideLeft"
                    offset={15}
                    style={axisLabelStyle}
                  />
                </YAxis>
                <Tooltip
                  contentStyle={{ borderRadius: 12 }}
                  formatter={(v) => [`${v}`, 'New']}
                />
                <defs>
                  <linearGradient id={LINE_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={`url(#${LINE_GRADIENT_ID})`}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </figure>
        </ChartCard>
      </section>

      {/* Pie chart */}
      <section role="region" aria-labelledby="status-chart-heading">
        <Typography id="status-chart-heading" component="h2" className="sr-only">
          Clients by Status
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard title="Clients by Status">
              <figure
                role="img"
                aria-label="Pie chart showing distribution of clients by status"
                style={{ margin: 0 }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={4}
                      outerRadius={80}
                      label
                    >
                      {statusData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12 }}
                      formatter={(v, _n, p) => [
                        v,
                        `${p.payload.name} – ${(((v as number) / total) * 100).toFixed(1)} %`,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </figure>
            </ChartCard>
          </Grid>

          {/* Bar chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <ChartCard title="Clients by Industry">
              <figure
                role="img"
                aria-label="Bar chart: number of clients by industry"
                style={{ margin: 0 }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={industryData}
                    margin={{ top: 10, right: 20, bottom: 15, left: 0 }}
                  >
                    <XAxis dataKey="industry">
                      <Label
                        value="Industry"
                        position="bottom"
                        offset={-6}
                        style={axisLabelStyle}
                      />
                    </XAxis>
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12 }}
                      formatter={(v) => [v, 'Clients']}
                    />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </figure>
            </ChartCard>
          </Grid>
        </Grid>
      </section>
    </main>
  );
}
