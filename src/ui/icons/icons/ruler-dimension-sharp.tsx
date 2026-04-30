import React from 'react';
import type { IconProps } from '../types';

export function RulerDimensionSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="11" width="2" height="5" fill={color}/>
      <rect x="15" y="11" width="2" height="5" fill={color}/>
      <rect x="7" y="11" width="2" height="5" fill={color}/>
      <rect x="3" y="11" width="2" height="10" fill={color}/>
      <rect x="19" y="11" width="2" height="10" fill={color}/>
      <rect x="5" y="11" width="14" height="2" fill={color}/>
      <rect x="5" y="19" width="14" height="2" fill={color}/>
      <rect x="3" y="3" width="2" height="6" fill={color}/>
      <rect x="19" y="3" width="2" height="6" fill={color}/>
      <rect x="5" y="5" width="14" height="2" fill={color}/>
    </svg>
  );
}
