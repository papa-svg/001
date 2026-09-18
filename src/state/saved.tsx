import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJSON, writeJSON } from './storage';

export type SavedKind = 'product' | 'set' | 'printing';
export interface SavedItem { kind: SavedKind; id: string; savedAt: string }

interface SavedApi {
  items: SavedItem[];
  has: (kind: SavedKind, id: string) => boolean;
  toggle: (kind: SavedKind, id: string) => boolean; // returns new state
}
const KEY = 'oddlys.saved.v1';
const Ctx = createContext<SavedApi | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>(() => readJSON<SavedItem[]>(KEY, []));
  useEffect(() => writeJSON(KEY, items), [items]);
  const has = useCallback((kind: SavedKind, id: string) => items.some((i) => i.kind === kind && i.id === id), [items]);
  const toggle = useCallback((kind: SavedKind, id: string) => {
    let next = false;
    setItems((prev) => {
      const exists = prev.some((i) => i.kind === kind && i.id === id);
      next = !exists;
      return exists ? prev.filter((i) => !(i.kind === kind && i.id === id)) : [...prev, { kind, id, savedAt: new Date().toISOString() }];
    });
    return next;
  }, []);
  const value = useMemo(() => ({ items, has, toggle }), [items, has, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useSaved() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('SavedProvider missing');
  return ctx;
}
