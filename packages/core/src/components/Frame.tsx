import React, { forwardRef } from 'react';
import { Frame as LeaferFrame, ILeafer } from 'leafer-ui';
import { useLeaferEffect } from '../hooks/useLeaferEffect';
import { useGetProps } from '../hooks/useGetProps';

export interface FrameProps {
  children?: React.ReactNode;
  fill?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

function FrameComponent({ children, ...props }: FrameProps, ref: React.Ref<LeaferFrame>) {
  const config = useGetProps(props);
  const frameRef = React.useRef<LeaferFrame | null>(null);

  React.useLayoutEffect(() => {
    if (!frameRef.current) {
      frameRef.current = new LeaferFrame(config);
    }

    // 处理子元素
    if (children && frameRef.current) {
      React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
          // 子元素会通过渲染器处理
          frameRef.current?.add(child as unknown as ILeafer);
        }
      });
    }

    return () => {
      if (frameRef.current) {
        frameRef.current.destroy();
        frameRef.current = null;
      }
    };
  }, [children, config]);

  useLeaferEffect(config, frameRef.current as unknown as ILeafer);

  React.useImperativeHandle(ref, () => frameRef.current as LeaferFrame);

  return null;
}

FrameComponent.displayName = 'Frame';

export const Frame = forwardRef<LeaferFrame, FrameProps>(FrameComponent); 