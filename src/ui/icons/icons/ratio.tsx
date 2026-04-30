import React from 'react';
import type { IconProps } from '../types';

export function RatioIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="6" width="16" height="2" fill={color}/>
      <rect x="6" y="20" width="16" height="2" transform="rotate(-90 6 20)" fill={color}/>
      <rect x="2" y="8" width="2" height="8" fill={color}/>
      <rect x="8" y="22" width="2" height="8" transform="rotate(-90 8 22)" fill={color}/>
      <rect x="4" y="16" width="16" height="2" fill={color}/>
      <rect x="16" y="20" width="16" height="2" transform="rotate(-90 16 20)" fill={color}/>
      <rect x="20" y="8" width="2" height="8" fill={color}/>
      <rect x="8" y="4" width="2" height="8" transform="rotate(-90 8 4)" fill={color}/>
    </svg>
  );
}
