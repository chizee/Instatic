import React from 'react';
import type { IconProps } from '../types';

export function TypeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      {/* Top horizontal bar of the "T" */}
      <rect x="2" y="2" width="20" height="4" fill={color}/>
      {/* Vertical stem */}
      <rect x="10" y="6" width="4" height="16" fill={color}/>
    </svg>
  );
}
