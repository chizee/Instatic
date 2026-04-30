import React from 'react';
import type { IconProps } from '../types';

export function ShuffleIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M10 19H2V17H10V19ZM22 19H14V17H22V19ZM12 17H10V11H12V17ZM18 7H20V9H22V11H20V13H18V15H16V11H12V9H16V5H18V7ZM8 11H2V9H8V11Z" fill={color}/>
    </svg>
  );
}
