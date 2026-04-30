import React from 'react';
import type { IconProps } from '../types';

export function ChartBarStackedIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="20" width="18" height="2" fill={color}/>
      <rect x="2" y="2" width="2" height="18" fill={color}/>
      <rect x="18" y="13" width="3" height="2" transform="rotate(90 18 13)" fill={color}/>
      <rect x="8" y="13" width="3" height="2" transform="rotate(90 8 13)" fill={color}/>
      <rect x="16" y="11" width="2" height="8" transform="rotate(90 16 11)" fill={color}/>
      <rect x="16" y="16" width="2" height="8" transform="rotate(90 16 16)" fill={color}/>
      <rect x="12" y="13" width="3" height="2" transform="rotate(90 12 13)" fill={color}/>
      <rect x="20" y="4" width="3" height="2" transform="rotate(90 20 4)" fill={color}/>
      <rect x="8" y="4" width="3" height="2" transform="rotate(90 8 4)" fill={color}/>
      <rect x="18" y="2" width="2" height="10" transform="rotate(90 18 2)" fill={color}/>
      <rect x="18" y="7" width="2" height="10" transform="rotate(90 18 7)" fill={color}/>
      <rect x="16" y="4" width="3" height="2" transform="rotate(90 16 4)" fill={color}/>
    </svg>
  );
}
