import React from 'react';
import type { IconProps } from '../types';

export function AiLockSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M9 8H15V4H17V8H19V10H21V20H19V22H5V20H3V10H5V8H7V4H9V8ZM7 13V19H9V17H11V19H13V13H11V15H9V13H7ZM15 11V19H17V11H15ZM9 11V13H11V11H9ZM15 4H9V2H15V4Z" fill={color}/>
    </svg>
  );
}
