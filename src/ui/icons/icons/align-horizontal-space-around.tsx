import React from 'react';
import type { IconProps } from '../types';

export function AlignHorizontalSpaceAroundIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="6" width="4" height="2" fill={color}/>
      <rect x="8" y="8" width="2" height="8" fill={color}/>
      <rect x="10" y="16" width="4" height="2" fill={color}/>
      <rect x="14" y="8" width="2" height="8" fill={color}/>
      <rect width="20" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 2)" fill={color}/>
      <rect width="20" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 18 2)" fill={color}/>
    </svg>
  );
}
