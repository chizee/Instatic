import React from 'react';
import type { IconProps } from '../types';

export function VolumeMinusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M12 22H10V20H8V18H10V6H8V4H10V2H12V22ZM8 18H6V16H8V18ZM6 10H4V14H6V16H2V8H6V10ZM22 13H14V11H22V13ZM8 8H6V6H8V8Z" fill={color}/>
    </svg>
  );
}
