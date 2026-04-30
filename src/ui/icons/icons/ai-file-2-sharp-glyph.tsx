import React from 'react';
import type { IconProps } from '../types';

export function AiFile2SharpGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M16 4H14V8H18V6H20V22H4V2H16V4ZM7 12V19H9V17H11V19H13V12H7ZM14 15V19H16V15H14ZM11 14V15H9V14H11ZM14 12V14H16V12H14ZM18 6H16V4H18V6Z" fill={color}/>
    </svg>
  );
}
