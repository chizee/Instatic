import React from 'react';
import type { IconProps } from '../types';

export function TextPlusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M18 15H21V17H18V20H16V17H13V15H16V12H18V15ZM11 18H3V16H11V18ZM11 14H3V12H11V14ZM19 10H3V8H19V10ZM19 6H3V4H19V6Z" fill={color}/>
    </svg>
  );
}
