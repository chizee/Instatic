import React from 'react';
import type { IconProps } from '../types';

export function PlayIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="15" y="11" width="2" height="2" transform="rotate(180 15 11)" fill={color}/>
      <rect x="15" y="15" width="2" height="2" transform="rotate(180 15 15)" fill={color}/>
      <rect x="13" y="17" width="2" height="2" transform="rotate(180 13 17)" fill={color}/>
      <rect x="13" y="9" width="2" height="2" transform="rotate(180 13 9)" fill={color}/>
      <rect x="11" y="7" width="2" height="2" transform="rotate(180 11 7)" fill={color}/>
      <rect x="9" y="21" width="2" height="18" transform="rotate(180 9 21)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 13)" fill={color}/>
      <rect x="9" y="17" width="2" height="2" fill={color}/>
    </svg>
  );
}
