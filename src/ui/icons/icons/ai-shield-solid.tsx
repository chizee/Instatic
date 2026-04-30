import React from 'react';
import type { IconProps } from '../types';

export function AiShieldSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 4H22V14H20V16H18V18H16V20H14V22H10V20H8V18H6V16H4V14H2V4H4V2H20V4ZM7 8V14H9V12H11V14H13V8H11V10H9V8H7ZM15 6V14H17V6H15ZM9 6V8H11V6H9Z" fill={color}/>
    </svg>
  );
}
