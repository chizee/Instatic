import React from 'react';
import type { IconProps } from '../types';

export function AdobeIllustratorSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 4H22V20H20V22H4V20H2V4H4V2H20V4ZM6 9V17H8V14H12V17H14V9H12V12H8V9H6ZM16 13V17H18V13H16ZM16 10V12H18V10H16ZM8 7V9H12V7H8Z" fill={color}/>
    </svg>
  );
}
