import React from 'react';
import type { IconProps } from '../types';

export function BambooIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="2" width="6" height="2" fill={color}/>
      <rect x="11" y="20" width="2" height="2" fill={color}/>
      <rect width="2" height="18" transform="matrix(-1 0 0 1 11 4)" fill={color}/>
      <rect width="2" height="18" transform="matrix(-1 0 0 1 15 4)" fill={color}/>
      <rect x="7" y="9" width="8" height="2" fill={color}/>
      <rect x="3" y="5" width="4" height="4" fill={color}/>
      <rect x="17" y="9" width="4" height="4" fill={color}/>
      <rect x="15" y="13" width="2" height="2" fill={color}/>
    </svg>
  );
}
