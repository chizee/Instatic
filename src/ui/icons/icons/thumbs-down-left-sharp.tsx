import React from 'react';
import type { IconProps } from '../types';

export function ThumbsDownLeftSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="14" width="2" height="12" transform="rotate(180 22 14)" fill={color}/>
      <rect x="20" y="4" width="14" height="2" transform="rotate(180 20 4)" fill={color}/>
      <rect x="6" y="8" width="2" height="4" transform="rotate(180 6 8)" fill={color}/>
      <rect x="4" y="12" width="2" height="4" transform="rotate(180 4 12)" fill={color}/>
      <rect x="10" y="14" width="6" height="2" transform="rotate(180 10 14)" fill={color}/>
      <rect x="10" y="16" width="2" height="2" transform="rotate(180 10 16)" fill={color}/>
      <rect x="8" y="20" width="2" height="4" transform="rotate(180 8 20)" fill={color}/>
      <rect x="10" y="22" width="2" height="2" transform="rotate(180 10 22)" fill={color}/>
      <rect x="12" y="20" width="2" height="2" transform="rotate(180 12 20)" fill={color}/>
      <rect x="14" y="18" width="2" height="2" transform="rotate(180 14 18)" fill={color}/>
      <rect x="16" y="16" width="2" height="2" transform="rotate(180 16 16)" fill={color}/>
      <rect x="20" y="14" width="4" height="2" transform="rotate(180 20 14)" fill={color}/>
      <rect x="18" y="12" width="2" height="8" transform="rotate(180 18 12)" fill={color}/>
    </svg>
  );
}
