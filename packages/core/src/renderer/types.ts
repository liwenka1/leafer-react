import { App, ILeafer } from 'leafer-ui';

export interface ElementWithProps extends ILeafer {
  props?: Record<string, any>;
}

export interface LeaferElement {
  type: string;
  props: Record<string, any>;
  children?: LeaferElement[];
} 