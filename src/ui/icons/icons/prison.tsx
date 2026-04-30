import React from 'react';
import type { IconProps } from '../types';

export function PrisonIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="3" width="2" height="18" fill={color}/>
      <rect x="13" y="3" width="2" height="18" fill={color}/>
      <rect x="9" y="3" width="2" height="3" fill={color}/>
      <rect x="9" y="18" width="2" height="3" fill={color}/>
      <rect x="5" y="3" width="2" height="3" fill={color}/>
      <rect x="5" y="18" width="2" height="3" fill={color}/>
      <rect x="3" y="8" width="8" height="2" fill={color}/>
      <rect x="3" y="14" width="8" height="2" fill={color}/>
      <rect x="3" y="10" width="2" height="4" fill={color}/>
      <rect x="9" y="10" width="2" height="4" fill={color}/>
      <rect x="6" y="11" width="2" height="2" fill={color}/>
    </svg>
  );
}
