import React from 'react';
import type { IconProps } from '../types';

export function AppMacSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 5H22V19H20V21H4V19H2V5H4V3H20V5ZM6 9H8V7H6V9ZM10 9H12V7H10V9ZM14 7V9H16V7H14Z" fill={color}/>
    </svg>
  );
}
