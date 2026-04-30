import React from 'react';
import type { IconProps } from '../types';

export function EuroIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="4" width="10" height="2" fill={color}/>
      <rect x="5" y="9" width="11" height="2" fill={color}/>
      <rect x="5" y="13" width="11" height="2" fill={color}/>
      <rect x="9" y="18" width="10" height="2" fill={color}/>
      <rect x="7" y="6" width="2" height="12" fill={color}/>
    </svg>
  );
}
