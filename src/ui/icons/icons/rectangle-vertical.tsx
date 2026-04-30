import React from 'react';
import type { IconProps } from '../types';

export function RectangleVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="2" width="2" height="10" transform="rotate(90 17 2)" fill={color}/>
      <rect x="7" y="4" width="16" height="2" transform="rotate(90 7 4)" fill={color}/>
      <rect x="17" y="20" width="2" height="10" transform="rotate(90 17 20)" fill={color}/>
      <rect x="19" y="4" width="16" height="2" transform="rotate(90 19 4)" fill={color}/>
    </svg>
  );
}
