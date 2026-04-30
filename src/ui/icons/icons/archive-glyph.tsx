import React from 'react';
import type { IconProps } from '../types';

export function ArchiveGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M21 22H3V9H21V22ZM9 11V13H15V11H9ZM23 7H1V2H23V7Z" fill={color}/>
    </svg>
  );
}
