// src/types.d.ts
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: {
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        id?: string;
        key?: string | number;
        lang?: string;
        role?: string;
        tabIndex?: number;
        title?: string;
        [key: string]: unknown;
      };
    }
  }

  interface Group {
    id: string;
    name: string;
    // Add other group properties as needed
  }

  type ApiResponse<T> = {
    data?: T;
    error?: string;
    message?: string;
  };
}