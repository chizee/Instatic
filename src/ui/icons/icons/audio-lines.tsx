import React from 'react';
import type { IconProps } from '../types';

export function AudioLinesIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="3" y="9" width="2" height="5" fill={color}/>
      <rect x="15" y="7" width="2" height="9" fill={color}/>
      <rect width="2" height="13" transform="matrix(-1 0 0 1 9 5)" fill={color}/>
      <rect width="2" height="19" transform="matrix(-1 0 0 1 13 2)" fill={color}/>
      <rect width="2" height="5" transform="matrix(-1 0 0 1 21 9)" fill={color}/>
    </svg>
  );
}
