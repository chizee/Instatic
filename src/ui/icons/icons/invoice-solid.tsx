import React from 'react';
import type { IconProps } from '../types';

export function InvoiceSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M19 4H21V22H19V20H17V22H15V20H13V22H11V20H9V22H7V20H5V22H3V4H5V2H19V4Z" fill={color}/>
    </svg>
  );
}
