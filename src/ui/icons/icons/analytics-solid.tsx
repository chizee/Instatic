import React from 'react';
import type { IconProps } from '../types';

export function AnalyticsSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 4H22V20H20V22H4V20H2V4H4V2H20V4ZM7 18H9V14H7V18ZM11 18H13V12H11V18ZM15 18H17V6H15V18Z" fill={color}/>
    </svg>
  );
}
