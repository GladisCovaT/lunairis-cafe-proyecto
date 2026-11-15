import { useCallback, useEffect, useRef, useState } from 'react';

// Aviso temporal en la esquina del panel
export function useToast() {
  const [toast, setToast] = useState({ message: '', show: false });
  const timer = useRef(null);

  const notify = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((current) => ({ ...current, show: false })), 2600);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, notify };
}
