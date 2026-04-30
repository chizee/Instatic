import React from 'react';
import type { IconProps } from '../types';

export function MenuIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 18H4V16H20V18ZM20 13H4V11H20V13ZM20 8H4V6H20V8Z" fill={color}/>
    </svg>
  );
}
