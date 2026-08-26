'use client'

import { useEffect, useRef, useState } from 'react'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from '@/lib/use-reduced-motion-safe'

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

/**
 * Soft, large-scale aurora.
 *
 * Deliberately low frequency and low contrast: three overlapping noise fields
 * are eased with smoothstep and layered over the background, which reads as
 * drifting light rather than the marbled, high-frequency texture a raw fbm
 * gives you. The pointer nudges the warp, so the field leans toward the cursor.
 */
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uBackground;
uniform float uIntensity;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 1.92;
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  p *= 1.15;

  float t = uTime * 0.045;
  vec2 pointer = (uPointer - 0.5) * 0.4;

  // One gentle warp is enough at this scale; more just reintroduces marbling.
  float w1 = fbm(p * 0.85 + vec2(0.0, t));
  float w2 = fbm(p * 0.7 + vec2(4.3, -t * 0.8));
  vec2 warp = vec2(w1, w2) * 0.85 + pointer;

  float a = smoothstep(-0.45, 0.85, fbm(p * 0.8 + warp));
  float b = smoothstep(-0.55, 0.75, fbm(p * 0.62 - warp * 1.15 + vec2(3.1, 1.7)));
  float c = smoothstep(0.15, 1.0, a * b);

  vec3 color = uBackground;
  color = mix(color, uColorA, a * 0.78 * uIntensity);
  color = mix(color, uColorB, b * 0.52 * uIntensity);
  color = mix(color, uColorC, c * 0.44 * uIntensity);

  // Elliptical vignette pulls the light into the upper third.
  float vignette = smoothstep(1.35, 0.15, length((p - vec2(0.15, 0.2)) * vec2(0.9, 1.25)));
  color = mix(uBackground, color, 0.25 + 0.75 * vignette);

  // Ordered dither: at these low gradients, banding is visible without it.
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 200.0;

  gl_FragColor = vec4(color + dither, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

type Rgb = [number, number, number]
type Palette = [Rgb, Rgb, Rgb]

export interface AuroraFieldProps {
  className?: string
  /** 0–1. How far the colour pushes past the background. */
  intensity?: number
  palette?: Palette
  background?: Rgb
}

/**
 * Linear-light approximations of ember, iris and signal.
 *
 * The light set is not the dark set at lower opacity: pushing saturated colour
 * over white turns muddy, so light mode uses pale, high-lightness tints and a
 * near-white base instead.
 */
const DARK_PALETTE: Palette = [
  [0.99, 0.55, 0.16],
  [0.62, 0.32, 0.95],
  [0.22, 0.78, 0.86],
]

const LIGHT_PALETTE: Palette = [
  [1.0, 0.86, 0.72],
  [0.86, 0.8, 0.98],
  [0.76, 0.93, 0.97],
]

const DARK_BACKGROUND: Rgb = [0.055, 0.05, 0.048]
const LIGHT_BACKGROUND: Rgb = [0.975, 0.968, 0.958]

/**
 * The hero's living background: a GPU-rendered aurora that drifts on its own
 * and leans toward the pointer.
 *
 * Everything about it is defensive. If WebGL is unavailable, if the context is
 * lost, or if shader compilation fails, the component renders nothing and the
 * CSS gradient underneath it carries the design. It pauses when scrolled out of
 * view, freezes on a single frame under `prefers-reduced-motion`, and caps the
 * device pixel ratio at 1.5 so a 4K display cannot melt a laptop GPU.
 */
export function AuroraField({ className, intensity, palette, background }: AuroraFieldProps) {
  const reduced = useReducedMotionSafe()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  const activePalette = palette ?? (isLight ? LIGHT_PALETTE : DARK_PALETTE)
  const activeBackground = background ?? (isLight ? LIGHT_BACKGROUND : DARK_BACKGROUND)
  // Light mode needs a lighter touch: the same intensity over a pale base reads
  // as a smudge rather than as light.
  const activeIntensity = intensity ?? (isLight ? 0.55 : 0.9)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      (canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      }) as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    if (!gl) {
      setSupported(false)
      return
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()

    if (!vertex || !fragment || !program) {
      setSupported(false)
      return
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setSupported(false)
      return
    }

    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uPointer = gl.getUniformLocation(program, 'uPointer')

    gl.uniform3fv(gl.getUniformLocation(program, 'uColorA'), activePalette[0])
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorB'), activePalette[1])
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorC'), activePalette[2])
    gl.uniform3fv(gl.getUniformLocation(program, 'uBackground'), activeBackground)
    gl.uniform1f(gl.getUniformLocation(program, 'uIntensity'), activeIntensity)

    const pointer = { x: 0.5, y: 0.5 }
    const target = { x: 0.5, y: 0.5 }

    const resize = (force = false) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio))
      if (!force && canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      // Uniforms are per-program state. Switching theme rebuilds the program,
      // and the size check would then skip the upload because the canvas
      // dimensions had not changed — leaving uResolution at (0,0) and the
      // shader rendering a flat wash.
      gl.uniform2f(uResolution, width, height)
    }

    resize(true)

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX / window.innerWidth
      target.y = 1 - event.clientY / window.innerHeight
    }

    let frame = 0
    let visible = true
    let elapsed = 0
    let last = performance.now()

    const render = (now: number) => {
      // Accumulate elapsed time rather than reading the wall clock, so pausing
      // off-screen resumes the animation instead of jumping it forward.
      elapsed += Math.min(now - last, 64) / 1000
      last = now

      // Ease the pointer so the field never snaps.
      pointer.x += (target.x - pointer.x) * 0.045
      pointer.y += (target.y - pointer.y) * 0.045

      resize()
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (!reduced && visible) frame = requestAnimationFrame(render)
    }

    // Under reduced motion `render` runs once, so nothing else would ever
    // resize the canvas and the single frame would stretch on rotation.
    const resizeObserver = new ResizeObserver(() => {
      resize(true)
      if (reduced) gl.drawArrays(gl.TRIANGLES, 0, 3)
    })
    resizeObserver.observe(canvas)

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible
        visible = entry.isIntersecting
        if (visible && !wasVisible && !reduced) {
          last = performance.now()
          frame = requestAnimationFrame(render)
        }
        if (!visible) cancelAnimationFrame(frame)
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    const onContextLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      setSupported(false)
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    if (!reduced) window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      observer.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      window.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
    // Re-created on theme change: the uniforms are set once at setup, and a
    // palette swap is rare enough that rebuilding the context is simpler than
    // threading a live uniform update through.
  }, [activeBackground, activeIntensity, activePalette, reduced])

  if (!supported) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-decor
      className={cn('h-full w-full', className)}
    />
  )
}
