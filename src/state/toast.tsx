import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

interface Toast { id: number; message: string; action?: { label: string; onClick: () => void } }
interface ToastApi { toasts: Toast[]; show: (message: string, action?: Toast['action']) => void; dismiss: (id: number) => void }
const Ctx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback<ToastApi['show']>((message, action) => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-2), { id, message, action }]);
    window.setTimeout(() => dismiss(id), action ? 6000 : 3200);
  }, [dismiss]);
  const value = useMemo(() => ({ toasts, show, dismiss }), [toasts, show, dismiss]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ToastProvider missing');
  return ctx;
}
