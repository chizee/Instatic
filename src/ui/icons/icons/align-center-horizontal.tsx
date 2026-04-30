import React from 'react';
import type { IconProps } from '../types';

export function AlignCenterHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="2" width="4" height="2" fill={color}/>
      <rect x="15" y="5" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 19)" fill={color}/>
      <rect x="3" y="15" width="2" height="5" fill={color}/>
      <rect x="3" y="4" width="2" height="5" fill={color}/>
      <rect x="13" y="7" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 17)" fill={color}/>
      <rect x="5" y="20" width="4" height="2" fill={color}/>
      <rect x="9" y="15" width="2" height="5" fill={color}/>
      <rect x="9" y="4" width="2" height="5" fill={color}/>
      <rect x="19" y="7" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 19 17)" fill={color}/>
      <rect x="2" y="11" width="20" height="2" fill={color}/>
    </svg>
  );
}
