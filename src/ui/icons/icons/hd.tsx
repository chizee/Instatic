import React from 'react';
import type { IconProps } from '../types';

export function HdIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M5 11H9V7H11V17H9V13H5V17H3V7H5V11ZM19 9H15V15H19V17H13V7H19V9ZM21 15H19V9H21V15Z" fill={color}/>
    </svg>
  );
}
