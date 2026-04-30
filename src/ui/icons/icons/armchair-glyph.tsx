import React from 'react';
import type { IconProps } from '../types';

export function ArmchairGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M4 10H6V14H18V10H20V8H22V17H20V21H18V19H6V21H4V17H2V8H4V10ZM16 12H8V8H4V3H20V8H16V12Z" fill={color}/>
    </svg>
  );
}
