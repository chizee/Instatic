import React from 'react';
import type { IconProps } from '../types';

export function ArrowDownIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M13 12H19V14H17V16H15V18H13V20H11V18H9V16H7V14H5V12H11V4H13V12Z" fill={color}/>
    </svg>
  );
}
