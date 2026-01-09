import { useCallback, useEffect, useState } from 'react';

type RefWithGetImage = {
  current: {
    getImage: () => Promise<string>;
  } | null;
};

export default function useGeneratedImages(refs: RefWithGetImage[]) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const results: string[] = [];
      for (const r of refs) {
        if (r && r.current && typeof r.current.getImage === 'function') {
          try {
            const png = await r.current.getImage();
            results.push(png);
          } catch (err) {
            results.push('');
          }
        } else {
          results.push('');
        }
      }
      setImages(results);
    } finally {
      setLoading(false);
    }
  }, [refs]);

  useEffect(() => {
    // automatically refresh on mount or when refs change
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();
    return () => { mounted = false; };
  }, [refresh]);

  return { images, loading, refresh } as const;
}
