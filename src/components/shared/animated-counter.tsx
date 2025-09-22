'use client'

import React from 'react'
import { useMotionValue, useTransform, animate } from 'framer-motion'

export function AnimatedCounter({ value, duration = 1.2, className }: { value: string | number; duration?: number; className?: string }) {
  const text = String(value)
  const match = text.match(/^(\d[\d,]*)?(.*)$/)
  const numericText = (match && match[1]) ? match[1].replace(/,/g, '') : ''
  const suffix = (match && match[2]) ? match[2] : ''

  const from = 0
  const to = numericText ? parseInt(numericText, 10) : 0
  const motionValue = useMotionValue(from)
  const rounded = useTransform(motionValue, latest => Math.floor(latest))
  const [display, setDisplay] = React.useState('0')

  React.useEffect(() => {
    const controls = animate(motionValue, to, { duration, ease: 'easeOut' })
    const unsub = rounded.on('change', v => {
      setDisplay(v.toLocaleString())
    })
    return () => {
      controls.stop()
      unsub()
    }
  }, [to, duration, motionValue, rounded])

  return (
    <span className={className}>{display}{suffix}</span>
  )
}


