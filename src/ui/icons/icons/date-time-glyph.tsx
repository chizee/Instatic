import React from 'react';
import type { IconProps } from '../types';

export function DateTimeGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M23 23H11V11H23V23ZM7 3H13V1H15V3H19V9H17V7H3V9H9V21H1V3H5V1H7V3ZM16 20H20V18H18V14H16V20Z" fill={color}/>
    </svg>
  );
}
