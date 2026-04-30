import React from 'react';
import type { IconProps } from '../types';

export function MinecraftFilledIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 4H22V20H20V22H4V20H2V4H4V2H20V4ZM10 10V12H8V18H10V16H14V18H16V12H14V10H10ZM6 6V10H10V6H6ZM14 6V10H18V6H14Z" fill={color}/>
    </svg>
  );
}
