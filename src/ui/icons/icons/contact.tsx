import React from 'react';
import type { IconProps } from '../types';

export function ContactIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="20" height="2" fill={color}/>
      <rect y="4" width="2" height="16" fill={color}/>
      <rect x="22" y="4" width="2" height="16" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="14" y="7" width="6" height="2" fill={color}/>
      <rect x="14" y="11" width="6" height="2" fill={color}/>
      <rect x="14" y="15" width="4" height="2" fill={color}/>
      <rect x="6" y="7" width="4" height="4" fill={color}/>
      <rect x="6" y="13" width="4" height="2" fill={color}/>
      <rect x="10" y="15" width="2" height="2" fill={color}/>
      <rect x="4" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
