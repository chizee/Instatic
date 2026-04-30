import React from 'react';
import type { IconProps } from '../types';

export function VolumeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M17 22H15V20H13V18H15V6H13V4H15V2H17V22ZM13 18H11V16H13V18ZM11 8V10H9V14H11V16H7V8H11ZM13 8H11V6H13V8Z" fill={color}/>
    </svg>
  );
}
