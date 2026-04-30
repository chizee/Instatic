import React from 'react';
import type { IconProps } from '../types';

export function ChartColumnBigSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="20" width="18" height="2" fill={color}/>
      <rect x="2" y="2" width="2" height="20" fill={color}/>
      <rect x="17" y="4" width="3" height="2" fill={color}/>
      <rect x="8" y="6" width="3" height="2" fill={color}/>
      <rect x="17" y="16" width="3" height="2" fill={color}/>
      <rect x="8" y="16" width="3" height="2" fill={color}/>
      <rect x="15" y="4" width="2" height="14" fill={color}/>
      <rect x="6" y="6" width="2" height="12" fill={color}/>
      <rect x="20" y="4" width="2" height="14" fill={color}/>
      <rect x="11" y="6" width="2" height="12" fill={color}/>
    </svg>
  );
}
