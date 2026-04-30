import React from 'react';
import type { IconProps } from '../types';

export function PiIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="6" width="2" height="15" fill={color}/>
      <rect x="14" y="6" width="2" height="13" fill={color}/>
      <rect x="16" y="19" width="4" height="2" fill={color}/>
      <rect x="6" y="4" width="14" height="2" fill={color}/>
      <rect x="4" y="6" width="2" height="4" fill={color}/>
    </svg>
  );
}
