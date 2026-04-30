import React from 'react';
import type { IconProps } from '../types';

export function CheckIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M10 18H8V16H10V18ZM8 16H6V14H8V16ZM12 14V16H10V14H12ZM6 14H4V12H6V14ZM14 14H12V12H14V14ZM16 12H14V10H16V12ZM18 10H16V8H18V10ZM20 8H18V6H20V8Z" fill={color}/>
    </svg>
  );
}
