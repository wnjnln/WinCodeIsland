import { useMascotAnimation, makeV, lerp, drawZs, type MascotBaseProps } from './utils'

// OpenAI black & white palette
const CLOUD_C = '#EBEBED'
const CLOUD_DARK = '#B2B2B8'
const PROMPT_C = '#111111'
const ALERT_C = '#FF8C00'
const KB_BASE = '#2E2E32'
const KB_KEY = '#66666A'
const KB_HI = '#FFFFFF'

function drawCloud(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  dy: number,
  squashX = 1,
  squashY = 1
) {
  const cx = 7.5
  const sx = (x: number, w: number) => {
    const nx = cx + (x - cx) * squashX
    return { x: nx, w: w * squashX }
  }

  const rows: { y: number; x: number; w: number }[] = [
    { y: 14, x: 4, w: 7 },
    { y: 13, x: 3, w: 9 },
    { y: 12, x: 2, w: 11 },
    { y: 11, x: 1, w: 13 },
    { y: 10, x: 1, w: 13 },
    { y: 9, x: 1, w: 13 },
    { y: 8, x: 2, w: 11 },
    { y: 7, x: 2, w: 11 },
    { y: 6, x: 3, w: 3 },
    { y: 6, x: 6, w: 3 },
    { y: 6, x: 9, w: 3 },
    { y: 5, x: 4, w: 2 },
    { y: 5, x: 6.5, w: 2 },
    { y: 5, x: 9, w: 2 },
  ]

  for (const row of rows) {
    const { x: adjX, w: adjW } = sx(row.x, row.w)
    const adjH = 1 * squashY
    const r = v.r(adjX, row.y * squashY + (1 - squashY) * 10, adjW, adjH, dy)
    ctx.fillRect(r.x, r.y, r.w, r.h)
  }
}

function drawPrompt(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  dy: number,
  color: string = PROMPT_C,
  cursorOn: boolean = true
) {
  // `>` chevron
  const p1 = v.r(3, 10, 1, 1, dy)
  ctx.fillRect(p1.x, p1.y, p1.w, p1.h)
  const p2 = v.r(4, 11, 1, 1, dy)
  ctx.fillRect(p2.x, p2.y, p2.w, p2.h)
  const p3 = v.r(3, 12, 1, 1, dy)
  ctx.fillRect(p3.x, p3.y, p3.w, p3.h)

  // `_` cursor
  if (cursorOn) {
    const c = v.r(6, 12, 3, 1, dy)
    ctx.fillRect(c.x, c.y, c.w, c.h)
  }
}

function drawShadow(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  width = 9,
  opacity = 0.3
) {
  const s = v.r(7.5 - width / 2, 15, width, 1)
  ctx.fillStyle = `rgba(0,0,0,${opacity})`
  ctx.fillRect(s.x, s.y, s.w, s.h)
}

function drawLegs(ctx: CanvasRenderingContext2D, v: ReturnType<typeof makeV>) {
  ctx.fillStyle = CLOUD_DARK
  const l1 = v.r(5, 14.5, 1, 1.5)
  ctx.fillRect(l1.x, l1.y, l1.w, l1.h)
  const l2 = v.r(9, 14.5, 1, 1.5)
  ctx.fillRect(l2.x, l2.y, l2.w, l2.h)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLEEP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawSleeping(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 15, 12, 4)
  const phase = (t % 4.0) / 4.0
  const float = Math.sin(phase * Math.PI * 2) * 0.8
  const cursorPhase = t % 1.2
  const cursorOn = cursorPhase < 0.6

  drawShadow(ctx, v, 7 + Math.abs(float) * 0.3, 0.2)
  drawLegs(ctx, v)

  ctx.fillStyle = CLOUD_C
  drawCloud(ctx, v, float)

  if (cursorOn) {
    ctx.fillStyle = PROMPT_C
    const c = v.r(6, 12, 3, 1, float)
    ctx.fillRect(c.x, c.y, c.w, c.h)
  }

  drawZs(ctx, sz, t)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawWork(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 16, 14, 3)
  const bounce = Math.sin(t * 2 * Math.PI / 0.4) * 1.0
  const cursorPhase = t % 0.3
  const cursorOn = cursorPhase < 0.15
  const keyPhase = Math.floor(t / 0.1) % 6
  const dy = bounce

  // Shadow
  const shadowW = 8 - Math.abs(dy) * 0.3
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.1, 0.35 - Math.abs(dy) * 0.03)})`
  const sh = v.r(4 + (8 - shadowW) / 2, 16, shadowW, 1)
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  drawLegs(ctx, v)

  // Keyboard
  ctx.fillStyle = KB_BASE
  const kb = v.r(0, 13, 15, 3)
  ctx.fillRect(kb.x, kb.y, kb.w, kb.h)

  ctx.fillStyle = KB_KEY
  for (let row = 0; row < 2; row++) {
    const ky = 13.5 + row * 1.2
    for (let col = 0; col < 6; col++) {
      const kx = 0.5 + col * 2.4
      const key = v.r(kx, ky, 1.8, 0.7)
      ctx.fillRect(key.x, key.y, key.w, key.h)
    }
  }

  // Key flash
  const flashRow = Math.floor(keyPhase / 3)
  const flashCol = keyPhase % 6
  const fkx = 0.5 + flashCol * 2.4
  const fky = 13.5 + flashRow * 1.2
  ctx.fillStyle = `rgba(255,255,255,0.9)`
  const fkey = v.r(fkx, fky, 1.8, 0.7)
  ctx.fillRect(fkey.x, fkey.y, fkey.w, fkey.h)

  // Cloud body
  ctx.fillStyle = CLOUD_C
  drawCloud(ctx, v, dy)

  // Prompt face
  drawPrompt(ctx, v, dy, PROMPT_C, cursorOn)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ALERT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawAlert(ctx: CanvasRenderingContext2D, sz: number, t: number, alive: boolean) {
  if (alive) {
    const pulse = (Math.sin(t * 2 * Math.PI) + 1) / 2
    const glowR = sz * 0.4 * (0.9 + pulse * 0.1)
    const grad = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, glowR)
    grad.addColorStop(0, `rgba(255, 140, 0, ${0.12 * (0.5 + pulse * 0.5)})`)
    grad.addColorStop(1, 'rgba(255, 140, 0, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(sz / 2, sz / 2, glowR, 0, Math.PI * 2)
    ctx.fill()
  }

  const cycle = t % 3.5
  const pct = cycle / 3.5

  const jumpY = lerp(
    [
      [0, 0],
      [0.03, 0],
      [0.1, -1],
      [0.15, 1.5],
      [0.175, -8],
      [0.2, -8],
      [0.25, 1.5],
      [0.275, -6],
      [0.3, -6],
      [0.35, 1.0],
      [0.375, -4],
      [0.4, -4],
      [0.45, 0.8],
      [0.475, -2],
      [0.5, -2],
      [0.55, 0.3],
      [0.62, 0],
      [1.0, 0],
    ],
    pct
  )

  const squashX = jumpY > 0.5 ? 1.0 + jumpY * 0.03 : 1.0
  const squashY = jumpY > 0.5 ? 1.0 - jumpY * 0.02 : 1.0
  const shakeX = pct > 0.15 && pct < 0.55 ? Math.sin(pct * 80) * 0.6 : 0
  const flash = pct > 0.03 && pct < 0.55 ? Math.sin(pct * 25) * 0.5 + 0.5 : 0.0
  const promptColor = flash > 0.5 ? ALERT_C : PROMPT_C

  const bangOp = lerp(
    [
      [0, 0],
      [0.03, 1],
      [0.1, 1],
      [0.55, 1],
      [0.62, 0],
      [1.0, 0],
    ],
    pct
  )
  const bangScale = lerp(
    [
      [0, 0.3],
      [0.03, 1.3],
      [0.1, 1.0],
      [0.55, 1.0],
      [0.62, 0.6],
      [1.0, 0.6],
    ],
    pct
  )

  const v = makeV(sz, sz, 16, 14, 3)

  // Shadow
  const shadowW = 8 * (1.0 - Math.abs(Math.min(0, jumpY)) * 0.04)
  const shadowOp = Math.max(0.08, 0.4 - Math.abs(Math.min(0, jumpY)) * 0.04)
  ctx.fillStyle = `rgba(0,0,0,${shadowOp})`
  const sh = v.r(4 + (8 - shadowW) / 2, 16, shadowW, 1)
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  drawLegs(ctx, v)

  // Cloud with shake
  ctx.save()
  ctx.translate(shakeX * v.s, 0)
  ctx.fillStyle = CLOUD_C
  drawCloud(ctx, v, jumpY, squashX, squashY)
  drawPrompt(ctx, v, jumpY, promptColor, true)
  ctx.restore()

  // ! mark
  if (bangOp > 0.01) {
    ctx.fillStyle = ALERT_C
    ctx.globalAlpha = bangOp
    const bw = 2 * bangScale
    const bx = 13
    const by = 4 + jumpY * 0.15
    const top = v.r(bx, by, bw, 3.5 * bangScale, 0)
    const dot = v.r(bx, by + 4.0 * bangScale, bw, 1.5 * bangScale, 0)
    ctx.fillRect(top.x, top.y, top.w, top.h)
    ctx.fillRect(dot.x, dot.y, dot.w, dot.h)
    ctx.globalAlpha = 1.0
  }
}

export function DexMascot({ size = 28, status = 'idle' }: MascotBaseProps) {
  const canvasRef = useMascotAnimation(status, (ctx, sz, t, alive) => {
    ctx.clearRect(0, 0, sz, sz)
    switch (status) {
      case 'idle':
        drawSleeping(ctx, sz, t)
        break
      case 'processing':
        drawWork(ctx, sz, t)
        break
      case 'waiting':
        drawAlert(ctx, sz, t, alive)
        break
    }
  })

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block"
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  )
}
