import React from 'react';
import type { IconProps } from '../types';

export function EthernetPortIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="5" width="2" height="11" fill={color}/>
      <rect x="21" y="5" width="2" height="11" fill={color}/>
      <rect x="3" y="16" width="3" height="2" fill={color}/>
      <rect x="18" y="16" width="3" height="2" fill={color}/>
      <rect x="16" y="18" width="2" height="2" fill={color}/>
      <rect x="6" y="18" width="2" height="2" fill={color}/>
      <path d="M8 20H16V22H8V20Z" fill={color}/>
      <rect x="5" y="7" width="2" height="4" fill={color}/>
      <rect x="9" y="7" width="2" height="4" fill={color}/>
      <rect x="13" y="7" width="2" height="4" fill={color}/>
      <rect x="17" y="7" width="2" height="4" fill={color}/>
    </svg>
  );
}
