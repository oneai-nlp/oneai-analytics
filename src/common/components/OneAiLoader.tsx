import React, { FC, useEffect, useRef, useState } from 'react';
import { loader } from '../assets/lottie/loader';
import { OneAiLoaderProps } from '../types/componentsInputs';
import { LottiePlayer } from 'lottie-web';

export const OneAiLoader: FC<OneAiLoaderProps> = ({
  height = '220px',
  width = '180px',
}: OneAiLoaderProps) => {
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
        animationData: loader,
      });

      return () => animation.destroy();
    }
    return;
  }, [lottie]);

  return (
    <div ref={ref} role="alert" aria-busy="true" style={{ height, width }} />
  );
};
