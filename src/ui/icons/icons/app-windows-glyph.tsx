import React from 'react';
import type { IconProps } from '../types';

export function AppWindowsGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M22 21H2V3H22V21ZM4 7H12V5H4V7ZM14 7H16V5H14V7ZM18 5V7H20V5H18Z" fill={color}/>
    </svg>
  );
}
