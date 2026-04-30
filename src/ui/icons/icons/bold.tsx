import React from 'react';
import type { IconProps } from '../types';

export function BoldIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M14 4V6H8V11H14V6H16V13H8V18H16V20H6V4H14ZM18 18H16V13H18V18Z" fill={color}/>
    </svg>
  );
}
