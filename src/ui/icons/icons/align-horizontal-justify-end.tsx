import React from 'react';
import type { IconProps } from '../types';

export function AlignHorizontalJustifyEndIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="20" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 2)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-1 0 0 1 7 4)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 9 6)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-1 0 0 1 7 18)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 4 6)" fill={color}/>
      <rect x="13" y="7" width="3" height="2" fill={color}/>
      <rect x="11" y="9" width="2" height="6" fill={color}/>
      <rect x="13" y="15" width="3" height="2" fill={color}/>
      <rect x="16" y="9" width="2" height="6" fill={color}/>
    </svg>
  );
}
