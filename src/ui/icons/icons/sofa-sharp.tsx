import React from 'react';
import type { IconProps } from '../types';

export function SofaSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="3" width="18" height="2" fill={color}/>
      <rect x="3" y="5" width="2" height="3" fill={color}/>
      <rect x="1" y="8" width="6" height="2" fill={color}/>
      <rect x="1" y="10" width="2" height="7" fill={color}/>
      <rect x="1" y="17" width="22" height="2" fill={color}/>
      <rect x="21" y="10" width="2" height="7" fill={color}/>
      <rect x="17" y="8" width="6" height="2" fill={color}/>
      <rect x="17" y="10" width="2" height="2" fill={color}/>
      <rect x="5" y="12" width="14" height="2" fill={color}/>
      <rect x="5" y="10" width="2" height="2" fill={color}/>
      <rect x="11" y="5" width="2" height="7" fill={color}/>
      <rect x="19" y="5" width="2" height="3" fill={color}/>
      <rect x="19" y="19" width="2" height="2" fill={color}/>
      <rect x="3" y="19" width="2" height="2" fill={color}/>
    </svg>
  );
}
