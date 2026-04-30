import React from 'react';
import type { IconProps } from '../types';

export function AlignHorizontalDistributeStartSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="4" width="3" height="2" fill={color}/>
      <rect x="4" y="2" width="2" height="20" fill={color}/>
      <rect x="6" y="18" width="3" height="2" fill={color}/>
      <rect x="9" y="4" width="2" height="16" fill={color}/>
      <rect width="3" height="2" transform="matrix(-1 0 0 1 18 7)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 20 7)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-1 0 0 1 18 15)" fill={color}/>
      <rect width="2" height="20" transform="matrix(-1 0 0 1 15 2)" fill={color}/>
    </svg>
  );
}
