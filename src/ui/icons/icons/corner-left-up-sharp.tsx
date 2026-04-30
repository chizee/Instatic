import React from 'react';
import type { IconProps } from '../types';

export function CornerLeftUpSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="18" width="14" height="2" transform="rotate(-90 8 18)" fill={color}/>
      <rect x="8" y="20" width="2" height="12" transform="rotate(-90 8 20)" fill={color}/>
      <rect x="14" y="8" width="2" height="2" transform="rotate(90 14 8)" fill={color}/>
      <rect x="12" y="6" width="2" height="2" transform="rotate(90 12 6)" fill={color}/>
      <rect x="8" y="6" width="2" height="2" transform="rotate(90 8 6)" fill={color}/>
      <rect x="12" y="8" width="2" height="8" transform="rotate(90 12 8)" fill={color}/>
    </svg>
  );
}
