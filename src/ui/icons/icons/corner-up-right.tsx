import React from 'react';
import type { IconProps } from '../types';

export function CornerUpRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="8" width="14" height="2" fill={color}/>
      <rect x="4" y="10" width="2" height="10" fill={color}/>
      <rect x="16" y="14" width="2" height="2" transform="rotate(180 16 14)" fill={color}/>
      <rect x="18" y="12" width="2" height="2" transform="rotate(180 18 12)" fill={color}/>
      <rect x="18" y="8" width="2" height="2" transform="rotate(180 18 8)" fill={color}/>
      <rect x="16" y="12" width="2" height="8" transform="rotate(180 16 12)" fill={color}/>
    </svg>
  );
}
