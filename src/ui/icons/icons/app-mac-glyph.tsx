import React from 'react';
import type { IconProps } from '../types';

export function AppMacGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M22 21H2V3H22V21ZM4 7H6V5H4V7ZM8 7H10V5H8V7ZM12 5V7H14V5H12Z" fill={color}/>
    </svg>
  );
}
