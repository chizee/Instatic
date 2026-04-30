import React from 'react';
import type { IconProps } from '../types';

export function ThumbsDown2LeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="13" width="2" height="10" transform="rotate(180 22 13)" fill={color}/>
      <rect x="20" y="3" width="16" height="2" transform="rotate(180 20 3)" fill={color}/>
      <rect x="4" y="13" width="2" height="10" transform="rotate(180 4 13)" fill={color}/>
      <rect x="11" y="15" width="7" height="2" transform="rotate(180 11 15)" fill={color}/>
      <rect x="10" y="17" width="2" height="2" transform="rotate(180 10 17)" fill={color}/>
      <rect x="8" y="21" width="2" height="4" transform="rotate(180 8 21)" fill={color}/>
      <rect x="10" y="23" width="2" height="2" transform="rotate(180 10 23)" fill={color}/>
      <rect x="12" y="21" width="2" height="2" transform="rotate(180 12 21)" fill={color}/>
      <rect x="14" y="19" width="2" height="2" transform="rotate(180 14 19)" fill={color}/>
      <rect x="16" y="17" width="2" height="2" transform="rotate(180 16 17)" fill={color}/>
      <rect x="20" y="15" width="4" height="2" transform="rotate(180 20 15)" fill={color}/>
      <rect x="18" y="13" width="2" height="10" transform="rotate(180 18 13)" fill={color}/>
      <rect x="8" y="11" width="4" height="2" transform="rotate(180 8 11)" fill={color}/>
      <rect x="6" y="7" width="2" height="2" transform="rotate(180 6 7)" fill={color}/>
    </svg>
  );
}
