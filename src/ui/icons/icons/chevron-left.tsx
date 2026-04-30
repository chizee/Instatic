import React from 'react';
import type { IconProps } from '../types';

export function ChevronLeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M8 13L8 11L10 11L10 13L8 13ZM10 11L10 9L12 9L12 11L10 11ZM10 15L10 13L12 13L12 15L10 15ZM12 9L12 7L14 7L14 9L12 9ZM12 17L12 15L14 15L14 17L12 17ZM14 7L14 5L16 5L16 7L14 7ZM14 19L14 17L16 17L16 19L14 19Z" fill={color}/>
    </svg>
  );
}
