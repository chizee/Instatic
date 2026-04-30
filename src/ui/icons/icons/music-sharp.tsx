import React from 'react';
import type { IconProps } from '../types';

export function MusicSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="12" width="8" height="2" fill={color}/>
      <rect x="2" y="14" width="2" height="4" fill={color}/>
      <rect x="2" y="18" width="8" height="2" fill={color}/>
      <rect x="8" y="6" width="2" height="12" fill={color}/>
      <rect x="18" y="6" width="2" height="12" fill={color}/>
      <rect x="12" y="14" width="2" height="4" fill={color}/>
      <rect x="12" y="12" width="8" height="2" fill={color}/>
      <rect x="12" y="18" width="8" height="2" fill={color}/>
      <rect x="8" y="4" width="12" height="2" fill={color}/>
    </svg>
  );
}
