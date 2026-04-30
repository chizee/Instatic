import React from 'react';
import type { IconProps } from '../types';

export function CableIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="6" width="8" height="2" fill={color}/>
      <rect x="23" y="18" width="8" height="2" transform="rotate(180 23 18)" fill={color}/>
      <rect x="1" y="8" width="2" height="2" fill={color}/>
      <rect x="23" y="16" width="2" height="2" transform="rotate(180 23 16)" fill={color}/>
      <rect x="3" y="10" width="4" height="2" fill={color}/>
      <rect x="21" y="14" width="4" height="2" transform="rotate(180 21 14)" fill={color}/>
      <rect x="7" y="8" width="2" height="2" fill={color}/>
      <rect x="17" y="16" width="2" height="2" transform="rotate(180 17 16)" fill={color}/>
      <rect x="2" y="4" width="2" height="2" fill={color}/>
      <rect x="22" y="20" width="2" height="2" transform="rotate(180 22 20)" fill={color}/>
      <rect x="6" y="4" width="2" height="2" fill={color}/>
      <rect x="18" y="20" width="2" height="2" transform="rotate(180 18 20)" fill={color}/>
      <rect x="11" y="5" width="2" height="13" fill={color}/>
      <rect x="4" y="12" width="2" height="6" fill={color}/>
      <rect x="6" y="18" width="5" height="2" fill={color}/>
      <rect x="13" y="3" width="5" height="2" fill={color}/>
      <rect x="18" y="5" width="2" height="7" fill={color}/>
    </svg>
  );
}
