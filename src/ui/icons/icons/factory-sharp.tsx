import React from 'react';
import type { IconProps } from '../types';

export function FactorySharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="2" height="20" fill={color}/>
      <rect x="4" y="20" width="16" height="2" fill={color}/>
      <rect x="20" y="7" width="2" height="15" fill={color}/>
      <rect x="18" y="7" width="2" height="2" fill={color}/>
      <rect x="12" y="7" width="2" height="2" fill={color}/>
      <rect x="16" y="9" width="2" height="2" fill={color}/>
      <rect x="10" y="9" width="2" height="2" fill={color}/>
      <rect x="14" y="7" width="2" height="6" fill={color}/>
      <rect x="8" y="4" width="2" height="9" fill={color}/>
      <rect x="4" y="2" width="6" height="2" fill={color}/>
      <rect x="7" y="15" width="2" height="2" fill={color}/>
      <rect x="11" y="15" width="2" height="2" fill={color}/>
      <rect x="15" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
