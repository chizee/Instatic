import React from 'react';
import type { IconProps } from '../types';

export function PaperplaneSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M21 15H17V17H13V19H9V21H3V17H5V13H9V11H5V7H3V3H9V5H13V7H17V9H21V11H23V13H21V15Z" fill={color}/>
    </svg>
  );
}
