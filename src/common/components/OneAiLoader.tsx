import type { LottiePlayer } from 'lottie-web';
import React, { useEffect, useRef, useState } from 'react';

export const OneAiLoader = ({
  height = '220px',
  width = '180px',
}: {
  height?: string;
  width?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('../assets/lottie/loader.json'),
      });

      return () => animation.destroy();
    }
    return;
  }, [lottie]);

  return <div ref={ref} style={{ height, width }} />;
};
