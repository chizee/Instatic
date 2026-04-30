import React from 'react';
import type { IconProps } from '../types';

export function MissedCallIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M12 18H10V16H12V18ZM10 16H8V14H10V16ZM14 16H12V14H14V16ZM8 14H6V12H8V14ZM16 14H14V12H16V14ZM6 12H4V10H6V12ZM18 12H16V10H18V12ZM22 6V12H20V10H18V8H16V6H22ZM4 10H2V8H4V10Z" fill={color}/>
    </svg>
  );
}
