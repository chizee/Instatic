import React from 'react';
import type { IconProps } from '../types';

export function GalleryHorizontalEndIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="12" y="2" width="8" height="2" fill={color}/>
      <rect x="10" y="4" width="2" height="16" fill={color}/>
      <rect x="12" y="20" width="8" height="2" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect x="6" y="4" width="2" height="16" fill={color}/>
      <rect x="2" y="6" width="2" height="12" fill={color}/>
    </svg>
  );
}
