import React from 'react';
import type { IconProps } from '../types';

export function SendCircleSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M18 4H20V6H22V18H20V20H18V22H6V20H4V18H2V6H4V4H6V2H18V4ZM7 11H9V13H7V17H13V15H16V13H18V11H16V9H13V7H7V11Z" fill={color}/>
    </svg>
  );
}
