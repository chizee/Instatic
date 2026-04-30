import React from 'react';
import type { IconProps } from '../types';

export function UndoIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M18 20H12V18H18V20ZM20 18H18V10H20V18ZM10 14H8V12H6V10H4V8H6V6H8V4H10V8H18V10H10V14Z" fill={color}/>
    </svg>
  );
}
