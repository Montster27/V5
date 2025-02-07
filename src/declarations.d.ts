declare module 'react';
declare module 'react/jsx-runtime';
declare module 'lucide-react' {
  const content: any;
  export default content;
}

import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
