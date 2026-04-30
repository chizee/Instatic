import React from 'react';
import type { IconProps } from '../types';

export function InvoiceTextSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M21 22H17V20H19V4H5V20H7V22H3V2H21V22ZM11 22H9V20H11V22ZM15 22H13V20H15V22ZM9 20H7V18H9V20ZM13 20H11V18H13V20ZM17 20H15V18H17V20ZM13 12H7V10H13V12ZM17 8H7V6H17V8Z" fill={color}/>
    </svg>
  );
}
