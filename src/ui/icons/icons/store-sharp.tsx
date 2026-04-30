import React from 'react';
import type { IconProps } from '../types';

export function StoreSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="13" width="2" height="8" fill={color}/>
      <rect x="3" y="21" width="18" height="2" fill={color}/>
      <rect x="19" y="13" width="2" height="8" fill={color}/>
      <rect x="10" y="11" width="4" height="2" fill={color}/>
      <rect x="14" y="9" width="4" height="2" fill={color}/>
      <rect x="18" y="11" width="4" height="2" fill={color}/>
      <rect x="6" y="9" width="4" height="2" fill={color}/>
      <rect x="2" y="11" width="4" height="2" fill={color}/>
      <rect y="5" width="2" height="6" fill={color}/>
      <rect x="22" y="5" width="2" height="6" fill={color}/>
      <rect y="3" width="24" height="2" fill={color}/>
      <rect x="8" y="15" width="8" height="2" fill={color}/>
      <rect x="8" y="17" width="2" height="4" fill={color}/>
      <rect x="14" y="17" width="2" height="4" fill={color}/>
    </svg>
  );
}
