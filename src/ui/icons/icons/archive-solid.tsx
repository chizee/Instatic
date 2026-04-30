import React from 'react';
import type { IconProps } from '../types';

export function ArchiveSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M21 20H19V22H5V20H3V9H21V20ZM9 11V13H15V11H9ZM21 4H23V7H1V4H3V2H21V4Z" fill={color}/>
    </svg>
  );
}
