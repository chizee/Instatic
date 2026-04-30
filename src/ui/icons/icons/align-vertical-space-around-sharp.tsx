import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalSpaceAroundSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="18" y="10" width="4" height="2" transform="rotate(90 18 10)" fill={color}/>
      <rect x="18" y="8" width="2" height="12" transform="rotate(90 18 8)" fill={color}/>
      <rect x="8" y="10" width="4" height="2" transform="rotate(90 8 10)" fill={color}/>
      <rect x="18" y="14" width="2" height="12" transform="rotate(90 18 14)" fill={color}/>
      <rect width="20" height="2" transform="matrix(-1 0 0 1 22 4)" fill={color}/>
      <rect width="20" height="2" transform="matrix(-1 0 0 1 22 18)" fill={color}/>
    </svg>
  );
}
