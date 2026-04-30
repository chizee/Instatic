import React from 'react';
import type { IconProps } from '../types';

export function HemisphereSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M16 6H20V8H22V14H20V16H18V18H16V20H8V18H6V16H4V14H2V8H4V6H8V4H16V6ZM8 12V14H16V12H8ZM4 10V12H8V10H4ZM16 10V12H20V10H16Z" fill={color}/>
    </svg>
  );
}
