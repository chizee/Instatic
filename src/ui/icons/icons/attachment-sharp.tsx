import React from 'react';
import type { IconProps } from '../types';

export function AttachmentSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="7" y="3" width="14" height="2" transform="rotate(90 7 3)" fill={color}/>
      <rect x="19" y="3" width="16" height="2" transform="rotate(90 19 3)" fill={color}/>
      <rect x="11" y="9" width="10" height="2" transform="rotate(90 11 9)" fill={color}/>
      <rect x="15" y="9" width="8" height="2" transform="rotate(90 15 9)" fill={color}/>
      <rect x="17" y="3" width="2" height="10" transform="rotate(90 17 3)" fill={color}/>
      <rect x="15" y="7" width="2" height="6" transform="rotate(90 15 7)" fill={color}/>
      <rect x="19" y="19" width="2" height="10" transform="rotate(90 19 19)" fill={color}/>
    </svg>
  );
}
