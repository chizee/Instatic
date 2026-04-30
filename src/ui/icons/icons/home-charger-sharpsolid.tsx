import React from 'react';
import type { IconProps } from '../types';

export function HomeChargerSharpsolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M14 4H16V6H18V8H20V10H22V22H13V18H15V16H17V12H15V10H13V12H11V10H9V12H7V16H9V18H11V22H2V10H4V8H6V6H8V4H10V2H14V4Z" fill={color}/>
    </svg>
  );
}
