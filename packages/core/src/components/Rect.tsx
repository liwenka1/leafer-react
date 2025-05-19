import React, { forwardRef } from 'react';
import { Rect as LeaferRect, ILeafer } from 'leafer-ui';
import { useLeaferEffect } from '../hooks/useLeaferEffect';
import { useGetProps } from '../hooks/useGetProps';

export interface RectProps {
  width?: number;
  height?: number;
  fill?: string;
  x?: number;
  y?: number;
  [key: string]: any;
}

function RectComponent(props: RectProps, ref: React.Ref<LeaferRect>) {
  const config = useGetProps(props);
  const rectRef = React.useRef<LeaferRect | null>(null);

  React.useLayoutEffect(() => {
    if (!rectRef.current) {
      rectRef.current = new LeaferRect(config);
    }
    return () => {
      if (rectRef.current) {
        rectRef.current.destroy();
        rectRef.current = null;
      }
    };
  }, [config]);

  useLeaferEffect(config, rectRef.current as unknown as ILeafer);

  React.useImperativeHandle(ref, () => rectRef.current as LeaferRect);

  return null;
}

RectComponent.displayName = 'Rect';

export const Rect = forwardRef<LeaferRect, RectProps>(RectComponent); 