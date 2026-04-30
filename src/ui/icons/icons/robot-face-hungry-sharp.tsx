import React from 'react';
import type { IconProps } from '../types';

export function RobotFaceHungrySharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="6" width="20" height="2" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="8" width="2" height="12" fill={color}/>
      <rect x="20" y="8" width="2" height="12" fill={color}/>
      <rect x="11" y="2" width="2" height="4" fill={color}/>
      <rect x="8" y="10" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="2" height="2" fill={color}/>
      <rect x="13" y="2" width="4" height="2" fill={color}/>
      <rect y="12" width="2" height="2" fill={color}/>
      <rect x="22" y="12" width="2" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 18)" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 16)" fill={color}/>
    </svg>
  );
}
