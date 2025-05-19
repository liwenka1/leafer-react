import { App, Frame, Rect, ILeafer } from 'leafer-ui';
import type { ElementWithProps, LeaferElement } from './types';
import React, { createElement, isValidElement } from 'react';

const LeaferComponents = {
  Frame,
  Rect,
} as const;

type LeaferComponentType = typeof LeaferComponents[keyof typeof LeaferComponents];

export function createLeaferElement(type: string | LeaferComponentType, props: any = {}): ILeafer {
  if (typeof type === 'string') {
    const Component = LeaferComponents[type as keyof typeof LeaferComponents];
    if (!Component) {
      throw new Error(`Unknown Leafer component: ${type}`);
    }
    return new Component(props) as unknown as ILeafer;
  }
  return new type(props) as unknown as ILeafer;
}

export function createLeaferApp(options: {
  render: () => React.ReactNode;
}) {
  let container: App | null = null;
  const leaferElements: ILeafer[] = [];

  const processElement = (element: React.ReactElement) => {
    if (!container) return;

    const { type, props } = element;
    let leaferElement: ILeafer | null = null;

    // 处理内置组件
    if (typeof type === 'string') {
      if (type in LeaferComponents) {
        const Component = LeaferComponents[type as keyof typeof LeaferComponents];
        leaferElement = new Component(props) as unknown as ILeafer;
      }
    }
    // 处理自定义组件
    else if (typeof type === 'function' && 'displayName' in type) {
      const Component = type as unknown as LeaferComponentType;
      leaferElement = new Component(props) as unknown as ILeafer;
    }

    if (leaferElement) {
      container.add(leaferElement);
      leaferElements.push(leaferElement);

      // 处理子元素
      if (props.children) {
        React.Children.forEach(props.children, child => {
          if (isValidElement(child)) {
            processElement(child);
          }
        });
      }
    }
  };

  return {
    mount(appContainer: App) {
      container = appContainer;
      const element = options.render();
      
      if (isValidElement(element)) {
        processElement(element);
      }
    },
    unmount() {
      // 清理所有创建的元素
      leaferElements.forEach(element => {
        element.destroy();
      });
      leaferElements.length = 0;
      container = null;
    }
  };
}

export type { ElementWithProps, LeaferElement }; 