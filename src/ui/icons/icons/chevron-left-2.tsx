import React from 'react';
import type { IconProps } from '../types';

export function ChevronLeft2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M15 17L13 17L13 15L11 15L11 13L9 13L9 11L11 11L11 9L13 9L13 7L15 7L15 17Z" fill={color}/>
    </svg>
  );
}
