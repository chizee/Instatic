import React from 'react';
import type { IconProps } from '../types';

export function BatteryMediumSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 9H22V15H20V19H4V17H2V7H4V5H20V9ZM6 9V15H8V9H6ZM10 9V15H12V9H10Z" fill={color}/>
    </svg>
  );
}
