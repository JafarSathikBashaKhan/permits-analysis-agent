import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type ToastState = { open: boolean; message: string; severity: AlertColor };
type ToastContextValue = (message: string, severity?: AlertColor) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>({ open: false, message: '', severity: 'success' });

  const showToast = useCallback((message: string, severity: AlertColor = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={2600}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setState((s) => ({ ...s, open: false }))}
          severity={state.severity}
          variant="filled"
          sx={{ minWidth: 260 }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return (message: string) => {
      // eslint-disable-next-line no-console
      console.warn('[toast] no ToastProvider mounted; message:', message);
    };
  }
  return ctx;
}
