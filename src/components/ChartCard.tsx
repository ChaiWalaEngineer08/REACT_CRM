
import { motion } from 'framer-motion';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';

const MotionBox = motion(Box);

export function ChartCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const radius = 6;          

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{
                rotateX: -2,
                rotateY: -8,
                
            }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            style={{
                position: 'relative',
                borderRadius: radius,
                overflow: 'hidden',      
                perspective: 800,
            }}

        >
           
            <MotionBox
                layout
                initial={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.4 }}
                transition={{ duration: 0.9 }}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: radius,
                    zIndex: -1,
                    background:
                        'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)',
                    filter: 'blur(4px)',
                    
                }}
            />

           
            <Card
                elevation={0}
                sx={{
                    borderRadius: radius,
                    backdropFilter: 'blur(2px)',
                    backgroundColor: 'rgba(255,255,255,0.75)',
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {title}
                    </Typography>
                    {children}
                </CardContent>
            </Card>
        </motion.div>
    );
}


export function KpiCard({
    label,
    value,
    onClick,
    ...a11yProps
}: {
    label: string;
    value: number | string;
    onClick?: () => void;
}& React.HTMLAttributes<HTMLDivElement>) {
    const theme = useTheme();
    const radius = 4;
    const borderW = 2;

    return (
        <Grid size={{ xs: 6, md: 3 }}>
            <motion.div whileHover={{ y: -4 }} style={{ height: '100%' }}>

                <Box

                {...a11yProps}
                    sx={{
                        borderRadius: radius,
                        p: `${borderW}px`,
                        height: '100%',
                        background: 'linear-gradient(135deg,#22c55e 0%,#facc15 100%)',
                    }}
                >

                    <Card
                        onClick={onClick}
                        elevation={0}
                        sx={{
                            cursor: onClick ? 'pointer' : 'default',
                            height: '100%',
                            borderRadius: radius,
                            backdropFilter: 'blur(6px)',
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(30,30,30,0.70)'
                                    : 'rgba(255,255,255,0.80)',
                            transition: 'box-shadow .25s',
                            '&:hover': { boxShadow: '0 12px 28px rgba(0,0,0,.18)' },
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                                {label}
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </motion.div>
        </Grid>
    );
}
