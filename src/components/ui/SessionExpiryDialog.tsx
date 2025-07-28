import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SessionExpiryDialog() {
  const { extendSession, logout } = useAuth();
  const [open, setOpen]           = useState(false);
  const nav                       = useNavigate();

  /* The AuthProvider will call `setWarnOpen(true)` through context or an event emitter. */
  // You can wire this with a tiny pub-sub or lift `open` state into context.

  const staySignedIn = () => {
    extendSession();          // reset idle timer
    setOpen(false);
  };

  const toLogin = () => {
    logout();
    nav('/login', { replace: true });
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Session expiring</DialogTitle>
      <DialogContent>Your session will end in 60 seconds due to inactivity.</DialogContent>
      <DialogActions>
        <Button onClick={staySignedIn} variant="outlined">Stay signed&nbsp;in</Button>
        <Button onClick={toLogin} variant="contained">Log&nbsp;in</Button>
      </DialogActions>
    </Dialog>
  );
}
