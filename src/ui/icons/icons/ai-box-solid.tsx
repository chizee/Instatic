import React from 'react';
import type { IconProps } from '../types';

export function AiBoxSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 16H22V18H24V20H22V22H20V24H18V22H16V20H14V18H16V16H18V14H20V16ZM20 4H22V12H16V14H14V16H12V22H4V20H2V4H4V2H20V4Z" fill={color}/>
    </svg>
  );
}
