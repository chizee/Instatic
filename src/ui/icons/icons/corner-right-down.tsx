import React from 'react';
import type { IconProps } from '../types';

export function CornerRightDownIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="16" y="6" width="14" height="2" transform="rotate(90 16 6)" fill={color}/>
      <rect x="14" y="4" width="2" height="10" transform="rotate(90 14 4)" fill={color}/>
      <rect x="10" y="16" width="2" height="10" transform="rotate(-90 10 16)" fill={color}/>
      <rect x="12" y="18" width="2" height="2" transform="rotate(-90 12 18)" fill={color}/>
      <rect x="16" y="18" width="2" height="2" transform="rotate(-90 16 18)" fill={color}/>
      <rect x="18" y="16" width="2" height="2" transform="rotate(-90 18 16)" fill={color}/>
    </svg>
  );
}
