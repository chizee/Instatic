import React from 'react';
import type { IconProps } from '../types';

export function CircleSquareIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="9" width="9" height="2" fill={color}/>
      <rect x="11" y="20" width="9" height="2" fill={color}/>
      <rect x="9" y="11" width="2" height="9" fill={color}/>
      <rect x="20" y="11" width="2" height="9" fill={color}/>
      <rect x="6" y="2" width="7" height="2" fill={color}/>
      <rect x="6" y="15" width="7" height="2" fill={color}/>
      <rect x="13" y="4" width="2" height="2" fill={color}/>
      <rect x="13" y="13" width="2" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="15" y="6" width="2" height="7" fill={color}/>
      <rect x="2" y="6" width="2" height="7" fill={color}/>
    </svg>
  );
}
