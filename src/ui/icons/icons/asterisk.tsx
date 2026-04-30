import React from 'react';
import type { IconProps } from '../types';

export function AsteriskIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="6" width="2" height="12" fill={color}/>
      <rect x="13" y="10" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 14)" fill={color}/>
      <rect x="11" y="14" width="2" height="2" transform="rotate(180 11 14)" fill={color}/>
      <rect x="15" y="8" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 9 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 16)" fill={color}/>
      <rect x="9" y="16" width="2" height="2" transform="rotate(180 9 16)" fill={color}/>
      <rect x="17" y="6" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 7 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 17 18)" fill={color}/>
      <rect x="7" y="18" width="2" height="2" transform="rotate(180 7 18)" fill={color}/>
    </svg>
  );
}
