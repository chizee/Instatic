import React from 'react';
import type { IconProps } from '../types';

export function AnvilSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M9 18H15V16H18V18H20V22H4V18H6V16H9V18ZM22 8H20V10H18V12H15V16H9V12H6V10H4V8H2V4H6V2H22V8Z" fill={color}/>
    </svg>
  );
}
