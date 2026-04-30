import React from 'react';
import type { IconProps } from '../types';

export function DriveUploadSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="12" width="20" height="2" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="14" width="2" height="6" fill={color}/>
      <rect x="20" y="14" width="2" height="6" fill={color}/>
      <rect x="6" y="16" width="2" height="2" fill={color}/>
      <rect x="10" y="16" width="2" height="2" fill={color}/>
      <rect width="2" height="9" transform="matrix(1 0 0 -1 11 11)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 6)" fill={color}/>
      <rect width="10" height="2" transform="matrix(1 0 0 -1 7 8)" fill={color}/>
    </svg>
  );
}
