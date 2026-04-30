import React from 'react';
import type { IconProps } from '../types';

export function CornerUpLeftSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="14" height="2" transform="matrix(-1 0 0 1 18 8)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 20 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 8 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 6 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 6 8)" fill={color}/>
      <rect width="2" height="8" transform="matrix(1 0 0 -1 8 12)" fill={color}/>
    </svg>
  );
}
