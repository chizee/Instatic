import React from 'react';
import type { IconProps } from '../types';

export function BetweenHorizontalEndIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="16" y="2" width="2" height="12" transform="rotate(90 16 2)" fill={color}/>
      <rect x="4" y="4" width="5" height="2" transform="rotate(90 4 4)" fill={color}/>
      <rect x="18" y="4" width="5" height="2" transform="rotate(90 18 4)" fill={color}/>
      <rect x="4" y="15" width="5" height="2" transform="rotate(90 4 15)" fill={color}/>
      <rect x="18" y="15" width="5" height="2" transform="rotate(90 18 15)" fill={color}/>
      <rect x="16" y="9" width="2" height="12" transform="rotate(90 16 9)" fill={color}/>
      <rect x="16" y="20" width="2" height="12" transform="rotate(90 16 20)" fill={color}/>
      <rect x="16" y="13" width="2" height="12" transform="rotate(90 16 13)" fill={color}/>
      <rect x="20" y="11" width="2" height="2" transform="rotate(90 20 11)" fill={color}/>
      <rect x="22" y="9" width="2" height="2" transform="rotate(90 22 9)" fill={color}/>
      <rect x="22" y="13" width="2" height="2" transform="rotate(90 22 13)" fill={color}/>
    </svg>
  );
}
