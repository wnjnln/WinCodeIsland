import { useEffect, useRef } from 'react'

export interface MascotBaseProps {
  size?: number
  status?: 'idle' | 'processing' | 'waiting'
}

export function useMascotAnimation(
  status: 'idle' | 'processing' | 'waiting',
  drawFn: (ctx: CanvasRenderingContext2D, size: number, t: number, alive: boolean) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = false
    const t = setTimeout(() => {
      aliveRef.current = true
    }, 50)
    return () => clearTimeout(t)
  }, [status])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stopped = false

    const step = (now: number) => {
      if (stopped) return
      const t = now / 1000
      drawFn(ctx, canvas.width, t, aliveRef.current)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [status, drawFn])

  return canvasRef
}

export function makeV(szW: number, szH: number, svgW: number, svgH: number, svgY0: number) {
  const s = Math.min(szW / svgW, szH / svgH)
  const ox = (szW - svgW * s) / 2
  const oy = (szH - svgH * s) / 2
  const y0 = svgY0
  return {
    s,
    ox,
    oy,
    y0,
    r(x: number, y: number, w: number, h: number, dy = 0) {
      return { x: ox + x * s, y: oy + (y - y0 + dy) * s, w: w * s, h: h * s }
    },
  }
}

export type VType = ReturnType<typeof makeV>

export function armPath(
  v: VType,
  x: number,
  y: number,
  w: number,
  h: number,
  pivotX: number,
  pivotY: number,
  angle: number,
  dy = 0
): Path2D {
  const a = (angle * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const corners = [
    [x - pivotX, y - pivotY],
    [x + w - pivotX, y - pivotY],
    [x + w - pivotX, y + h - pivotY],
    [x - pivotX, y + h - pivotY],
  ]
  const path = new Path2D()
  corners.forEach(([cx, cy], i) => {
    const rx = cx * ca - cy * sa + pivotX
    const ry = cx * sa + cy * ca + pivotY
    const ptX = v.ox + rx * v.s
    const ptY = v.oy + (ry - v.y0 + dy) * v.s
    if (i === 0) path.moveTo(ptX, ptY)
    else path.lineTo(ptX, ptY)
  })
  path.closePath()
  return path
}

export function lerp(keyframes: [number, number][], at: number): number {
  if (keyframes.length === 0) return 0
  if (at <= keyframes[0][0]) return keyframes[0][1]
  for (let i = 1; i < keyframes.length; i++) {
    if (at <= keyframes[i][0]) {
      const t = (at - keyframes[i - 1][0]) / (keyframes[i][0] - keyframes[i - 1][0])
      return keyframes[i - 1][1] + (keyframes[i][1] - keyframes[i - 1][1]) * t
    }
  }
  return keyframes[keyframes.length - 1][1]
}

export function drawZs(
  ctx: CanvasRenderingContext2D,
  sz: number,
  t: number,
  count = 3
) {
  for (let i = 0; i < count; i++) {
    const ci = i
    const cycle = 2.8 + ci * 0.3
    const delay = ci * 0.9
    let phaseZ = ((t - delay) % cycle) / cycle
    if (phaseZ < 0) phaseZ += 1
    const p = Math.max(0, phaseZ)
    const fontSize = Math.max(6, sz * (0.18 + p * 0.1))
    const baseOpacity = 0.7 - ci * 0.1
    const opacity = p < 0.8 ? baseOpacity : (1.0 - p) * 3.5 * baseOpacity
    const xOff = sz * (0.08 + ci * 0.06 + Math.sin(p * Math.PI * 2) * 0.03)
    const yOff = -sz * (0.15 + p * 0.38)

    ctx.save()
    ctx.font = `900 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.fillStyle = `rgba(255,255,255,${opacity})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('z', sz * 0.5 + xOff, sz * 0.5 + yOff)
    ctx.restore()
  }
}
