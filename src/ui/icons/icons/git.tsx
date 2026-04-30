import React from 'react';
import type { IconProps } from '../types';

export function GitIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M5 2H9V4H7V6H5V2Z" fill={color}/>
      <path d="M5 12H3V6H5V12Z" fill={color}/>
      <path d="M7 14H5V12H7V14Z" fill={color}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z" fill={color}/>
      <path d="M15 4V6H9V4H15Z" fill={color}/>
      <path d="M19 6H17V4H15V2H19V6Z" fill={color}/>
      <path d="M19 12V6H21V12H19Z" fill={color}/>
      <path d="M17 14V12H19V14H17Z" fill={color}/>
      <path d="M15 16V14H17V16H15Z" fill={color}/>
      <path d="M15 18H13V16H15V18Z" fill={color}/>
      <path d="M15 18H17V22H15V18Z" fill={color}/>
    </svg>
  );
}
