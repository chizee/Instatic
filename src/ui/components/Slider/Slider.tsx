import {
  forwardRef,
  useRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type Ref,
} from 'react'
import { cn } from '@ui/cn'
import { getSliderProgress } from './Slider.utils'
import styles from './Slider.module.css'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min: number
  max: number
}

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (!ref) return
  if (typeof ref === 'function') {
    ref(value)
  } else {
    ref.current = value
  }
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    className,
    disabled,
    min,
    max,
    value,
    defaultValue,
    style,
    onInput,
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const numericValue = Number(value ?? defaultValue ?? min)
  const sliderStyle: CSSProperties & { '--slider-progress': string } = {
    ...style,
    '--slider-progress': getSliderProgress(numericValue, min, max),
  }

  return (
    <input
      ref={(node) => {
        inputRef.current = node
        assignRef(ref, node)
      }}
      type="range"
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      style={sliderStyle}
      onInput={(event) => {
        const v = event.currentTarget.valueAsNumber
        event.currentTarget.style.setProperty('--slider-progress', getSliderProgress(v, min, max))
        onInput?.(event)
      }}
      className={cn(styles.slider, disabled && styles.disabled, className)}
      {...props}
    />
  )
})
