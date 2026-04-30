import React from 'react';
import type { IconProps } from '../types';

export function Robot4Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="20" width="18" height="2" fill={color}/>
      <rect x="5" y="14" width="14" height="2" fill={color}/>
      <rect x="3" y="6" width="2" height="8" fill={color}/>
      <rect x="3" y="16" width="2" height="6" fill={color}/>
      <rect x="19" y="6" width="2" height="8" fill={color}/>
      <rect x="19" y="16" width="2" height="6" fill={color}/>
      <rect x="5" y="4" width="14" height="2" fill={color}/>
      <rect x="11" y="2" width="2" height="4" fill={color}/>
      <rect x="8" y="8" width="2" height="3" fill={color}/>
      <rect x="14" y="8" width="2" height="3" fill={color}/>
    </svg>
  );
}
