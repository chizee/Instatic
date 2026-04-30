import React from 'react';
import type { IconProps } from '../types';

export function Robot2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="19" width="2" height="4" fill={color}/>
      <rect x="4" y="17" width="16" height="2" fill={color}/>
      <rect x="3" y="13" width="18" height="2" fill={color}/>
      <rect x="18" y="19" width="2" height="4" fill={color}/>
      <rect x="3" y="5" width="2" height="8" fill={color}/>
      <rect x="19" y="5" width="2" height="8" fill={color}/>
      <rect x="3" y="3" width="18" height="2" fill={color}/>
      <rect x="11" y="1" width="2" height="4" fill={color}/>
      <rect x="8" y="7" width="2" height="3" fill={color}/>
      <rect x="14" y="7" width="2" height="3" fill={color}/>
    </svg>
  );
}
