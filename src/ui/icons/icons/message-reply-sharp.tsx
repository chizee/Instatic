import React from 'react';
import type { IconProps } from '../types';

export function MessageReplySharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="16" width="4" height="2" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 22 4)" fill={color}/>
      <rect width="2" height="18" transform="matrix(-1 0 0 1 4 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 18)" fill={color}/>
      <rect x="10" y="12" width="10" height="2" fill={color}/>
      <rect x="12" y="10" width="2" height="2" fill={color}/>
      <rect x="12" y="14" width="2" height="2" fill={color}/>
      <rect x="14" y="8" width="2" height="8" fill={color}/>
      <rect x="14" y="16" width="2" height="2" fill={color}/>
      <rect x="20" y="14" width="2" height="2" fill={color}/>
    </svg>
  );
}
