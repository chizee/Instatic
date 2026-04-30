import React from 'react';
import type { IconProps } from '../types';

export function VercelSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M13 5H15V8H17V11H19V14H21V17H23V20H1V17H3V14H5V11H7V8H9V5H11V3H13V5Z" fill={color}/>
    </svg>
  );
}
