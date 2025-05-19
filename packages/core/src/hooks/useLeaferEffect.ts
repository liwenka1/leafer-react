import { useEffect, useRef } from 'react';
import type { ElementWithProps } from '../renderer/types';

export function useLeaferEffect(
  props: Record<string, any>,
  element: ElementWithProps | null
) {
  const prevPropsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!element) return;

    const prevProps = prevPropsRef.current;
    const changedProps = Object.keys(props).filter(
      key => prevProps[key] !== props[key]
    );

    // 更新变化的属性
    changedProps.forEach(key => {
      if (key in element) {
        (element as any)[key] = props[key];
      }
    });

    // 保存当前属性作为下次比较
    prevPropsRef.current = { ...props };
  }, [props, element]);
} 