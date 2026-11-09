import { createContext, useContext } from 'react';

/** Ref to the main scroll container (<main id="top">). */
export const ScrollContext = createContext(null);

export function useScrollContainer() {
  return useContext(ScrollContext);
}
