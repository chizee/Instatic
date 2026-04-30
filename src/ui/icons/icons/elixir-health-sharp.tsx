import React from 'react';
import type { IconProps } from '../types';

export function ElixirHealthSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="20" width="12" height="2" fill={color}/>
      <rect x="4" y="8" width="2" height="14" fill={color}/>
      <rect x="18" y="8" width="2" height="14" fill={color}/>
      <rect x="6" y="6" width="5" height="2" fill={color}/>
      <rect x="13" y="6" width="5" height="2" fill={color}/>
      <rect x="9" y="4" width="2" height="4" fill={color}/>
      <rect x="13" y="4" width="2" height="4" fill={color}/>
      <rect x="7" y="2" width="10" height="2" fill={color}/>
      <rect x="11" y="11" width="2" height="6" fill={color}/>
      <rect x="9" y="15" width="2" height="6" transform="rotate(-90 9 15)" fill={color}/>
    </svg>
  );
}
