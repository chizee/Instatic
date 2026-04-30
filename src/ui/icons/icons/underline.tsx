import React from 'react';
import type { IconProps } from '../types';

export function UnderlineIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M19 20H5V18H19V20ZM16 16H8V14H16V16ZM8 14H6V4H8V14ZM18 14H16V4H18V14Z" fill={color}/>
    </svg>
  );
}
