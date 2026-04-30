import React from 'react';
import type { IconProps } from '../types';

export function ChatText2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="20" height="2" transform="matrix(-1 0 0 1 22 2)" fill={color}/>
      <rect width="16" height="2" transform="matrix(-1 0 0 1 22 16)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 22 4)" fill={color}/>
      <rect width="2" height="18" transform="matrix(-1 0 0 1 4 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 18)" fill={color}/>
      <rect x="6" y="12" width="4" height="2" fill={color}/>
      <rect x="6" y="8" width="8" height="2" fill={color}/>
    </svg>
  );
}
