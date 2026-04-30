import React from 'react';
import type { IconProps } from '../types';

export function LuggageIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="10" width="2" height="8" fill={color}/>
      <rect x="18" y="10" width="2" height="8" fill={color}/>
      <rect x="6" y="18" width="12" height="2" fill={color}/>
      <rect x="8" y="20" width="2" height="2" fill={color}/>
      <rect x="14" y="20" width="2" height="2" fill={color}/>
      <rect x="6" y="8" width="12" height="2" fill={color}/>
      <rect x="8" y="4" width="2" height="4" fill={color}/>
      <rect x="10" y="2" width="4" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="4" fill={color}/>
      <rect x="9" y="12" width="2" height="4" fill={color}/>
      <rect x="13" y="12" width="2" height="4" fill={color}/>
    </svg>
  );
}
