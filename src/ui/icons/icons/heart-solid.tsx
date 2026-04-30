import React from 'react';
import type { IconProps } from '../types';

export function HeartSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M9 4H11V6H13V4H15V2H19V4H21V6H23V12H21V14H19V16H17V18H15V20H13V22H11V20H9V18H7V16H5V14H3V12H1V6H3V4H5V2H9V4Z" fill={color}/>
    </svg>
  );
}
