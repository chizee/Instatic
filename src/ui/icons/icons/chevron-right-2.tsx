import React from 'react';
import type { IconProps } from '../types';

export function ChevronRight2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M9 17L11 17L11 15L13 15L13 13L15 13L15 11L13 11L13 9L11 9L11 7L9 7L9 17Z" fill={color}/>
    </svg>
  );
}
