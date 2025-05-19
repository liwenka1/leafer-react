import { useMemo } from 'react';

export function useGetProps(attrs: Record<string, any>) {
  return useMemo(() => {
    const config: Record<string, any> = {};
    
    // 过滤和转换属性
    Object.entries(attrs).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        // 处理事件监听器
        config[key.toLowerCase()] = value;
      } else {
        // 处理普通属性
        config[key] = value;
      }
    });

    return config;
  }, [attrs]);
} 