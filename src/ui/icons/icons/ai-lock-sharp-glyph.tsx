import React from 'react';
import type { IconProps } from '../types';

export function AiLockSharpGlyphIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M9 8H15V4H17V8H21V22H3V8H7V4H9V8ZM7 11V19H9V17H11V19H13V11H7ZM15 11V19H17V11H15ZM11 13V15H9V13H11ZM15 4H9V2H15V4Z" fill={color}/>
    </svg>
  );
}
