import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalDistributeStartIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 4 6)" fill={color}/>
      <rect width="2" height="20" transform="matrix(-4.37114e-08 1 1 4.37114e-08 2 4)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 18 6)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-4.37114e-08 1 1 4.37114e-08 6 9)" fill={color}/>
      <rect x="7" y="18" width="3" height="2" transform="rotate(-90 7 18)" fill={color}/>
      <rect x="9" y="20" width="2" height="6" transform="rotate(-90 9 20)" fill={color}/>
      <rect x="15" y="18" width="3" height="2" transform="rotate(-90 15 18)" fill={color}/>
      <rect x="2" y="15" width="2" height="20" transform="rotate(-90 2 15)" fill={color}/>
    </svg>
  );
}
