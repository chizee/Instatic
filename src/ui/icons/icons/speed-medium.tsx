import React from 'react';
import type { IconProps } from '../types';

export function SpeedMediumIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M5 19H3V17H5V19ZM21 19H19V17H21V19ZM3 17H1V11H3V17ZM14 17H10V13H11V5H13V13H14V17ZM23 17H21V11H23V17ZM5 11H3V9H5V11ZM21 11H19V9H21V11ZM9 9H5V7H9V9ZM19 9H15V7H19V9Z" fill={color}/>
    </svg>
  );
}
