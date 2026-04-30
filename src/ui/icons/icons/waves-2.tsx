import React from 'react';
import type { IconProps } from '../types';

export function Waves2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="2" transform="matrix(1 0 0 -1 4 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 20 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 4 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 20 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 4 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 20 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 18 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 18 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 18 6)" fill={color}/>
      <rect width="3" height="2" transform="matrix(1 0 0 -1 6 20)" fill={color}/>
      <rect width="7" height="2" transform="matrix(1 0 0 -1 6 14)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 6 8)" fill={color}/>
      <rect width="7" height="2" transform="matrix(1 0 0 -1 11 20)" fill={color}/>
      <rect width="3" height="2" transform="matrix(1 0 0 -1 15 14)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 13 8)" fill={color}/>
    </svg>
  );
}
