import { useMascotAnimation, makeV, lerp, drawZs, type MascotBaseProps } from './utils'

// Kimi / Moonshot AI palette — deep blue-violet
const BODY_C = '#4A6CF7'
const BODY_DARK = '#3B5BE0'
const EYE_C = '#FFFFFF'
const MOON_C = '#C7D2FE'
const ALERT_C = '#FF3D00'
const KB_BASE = '#2E3A59'
const KB_KEY = '#5A6A8A'
const KB_HI = '#FFFFFF'

function drawMoon(ctx: CanvasRenderingContext2D, v: ReturnType<typeof makeV>, dy: number) {
  // Small crescent moon on top of head
  ctx.fillStyle = MOON_C
  const c1 = v.r(5, 3, 5, 5, dy)
  ctx.beginPath()
  ctx.arc(c1.x + c1.w / 2, c1.y + c1.h / 2, c1.w / 2, 0, Math.PI * 2)
  ctx.fill()

  // Cutout for crescent effect
  ctx.fillStyle = BODY_C
  const c2 = v.r(6.5, 3.5, 4, 4, dy)
  ctx.beginPath()
  ctx.arc(c2.x + c2.w / 2, c2.y + c2.h / 2, c2.w / 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  dy: number,
  scaleX = 1,
  scaleY = 1
) {
  const cx = 7.5
  const w = 9 * scaleX
  const h = 7 * scaleY
  const x = cx - w / 2
  const y = 9 - h / 2
  const r = v.r(x, y, w, h, dy)
  ctx.fillRect(r.x, r.y, r.w, r.h)
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  dy: number,
  scale = 1
) {
  ctx.fillStyle = EYE_C
  const h = 1.5 * scale
  const y = 8.5 + (1.5 - h) / 2
  const e1 = v.r(5, y, 1.2, h, dy)
  ctx.beginPath()
  ctx.arc(e1.x + e1.w / 2, e1.y + e1.h / 2, e1.w / 2, 0, Math.PI * 2)
  ctx.fill()
  const e2 = v.r(8.8, y, 1.2, h, dy)
  ctx.beginPath()
  ctx.arc(e2.x + e2.w / 2, e2.y + e2.h / 2, e2.w / 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawLegs(ctx: CanvasRenderingContext2D, v: ReturnType<typeof makeV>, dy: number) {
  ctx.fillStyle = BODY_DARK
  const l1 = v.r(5, 12.5, 1.2, 2.5, dy)
  ctx.fillRect(l1.x, l1.y, l1.w, l1.h)
  const l2 = v.r(8.8, 12.5, 1.2, 2.5, dy)
  ctx.fillRect(l2.x, l2.y, l2.w, l2.h)
}

function drawArms(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  dy: number,
  angleL: number,
  angleR: number
) {
  ctx.fillStyle = BODY_DARK
  // Left arm
  const al = v.r(1.5, 9, 2, 1.5, dy)
  ctx.save()
  ctx.translate(al.x + al.w / 2, al.y + al.h / 2)
  ctx.rotate((angleL * Math.PI) / 180)
  ctx.fillRect(-al.w / 2, -al.h / 2, al.w, al.h)
  ctx.restore()

  // Right arm
  const ar = v.r(11.5, 9, 2, 1.5, dy)
  ctx.save()
  ctx.translate(ar.x + ar.w / 2, ar.y + ar.h / 2)
  ctx.rotate((angleR * Math.PI) / 180)
  ctx.fillRect(-ar.w / 2, -ar.h / 2, ar.w, ar.h)
  ctx.restore()
}

function drawShadow(
  ctx: CanvasRenderingContext2D,
  v: ReturnType<typeof makeV>,
  width = 7,
  opacity = 0.3
) {
  const s = v.r(7.5 - width / 2, 15, width, 1)
  ctx.fillStyle = `rgba(0,0,0,${opacity})`
  ctx.fillRect(s.x, s.y, s.w, s.h)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLEEP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawSleeping(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 15, 12, 4)
  const phase = (t % 4.5) / 4.5
  const breathe = phase < 0.4 ? Math.sin((phase / 0.4) * Math.PI) : 0
  const float = Math.sin(phase * Math.PI * 2) * 0.6
  const dy = float

  const shadowScale = 1.0 + breathe * 0.03
  drawShadow(ctx, v, 7 * shadowScale, 0.25 + breathe * 0.08)

  ctx.fillStyle = BODY_C
  drawBody(ctx, v, dy, 1.0 + breathe * 0.01, 1.0 + breathe * 0.02)
  drawMoon(ctx, v, dy)
  drawLegs(ctx, v, dy)

  // Sleepy eyes (smaller, dimmer)
  ctx.fillStyle = `rgba(255,255,255,${0.6 + breathe * 0.2})`
  const eyeH = 0.8
  const eyeY = 8.5 + (1.5 - eyeH) / 2
  const e1 = v.r(5, eyeY, 1.2, eyeH, dy)
  ctx.beginPath()
  ctx.arc(e1.x + e1.w / 2, e1.y + e1.h / 2, e1.w / 2, 0, Math.PI * 2)
  ctx.fill()
  const e2 = v.r(8.8, eyeY, 1.2, eyeH, dy)
  ctx.beginPath()
  ctx.arc(e2.x + e2.w / 2, e2.y + e2.h / 2, e2.w / 2, 0, Math.PI * 2)
  ctx.fill()

  drawZs(ctx, sz, t)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawWork(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 16, 14, 3)
  const bounce = Math.sin(t * 2 * Math.PI / 0.35) * 1.0
  const breathe = Math.sin(t * 2 * Math.PI / 3.2)

  const armLRaw = Math.sin(t * 2 * Math.PI / 0.15)
  const angleL = armLRaw * 25 - 20
  const armRRaw = Math.sin(t * 2 * Math.PI / 0.12)
  const angleR = armRRaw * 25 + 20

  const leftHit = armLRaw > 0.3
  const rightHit = armRRaw > 0.3
  const leftKeyCol = Math.floor(t / 0.15) % 3
  const rightKeyCol = 3 + Math.floor(t / 0.12) % 3

  const blinkPhase = t % 3.5
  const eyeScale = blinkPhase > 1.4 && blinkPhase < 1.55 ? 0.1 : 1.0

  const dy = bounce

  // Shadow
  const shadowW = 7 - Math.abs(dy) * 0.3
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.1, 0.35 - Math.abs(dy) * 0.03)})`
  const sh = v.r(4.5 + (7 - shadowW) / 2, 16, shadowW, 1)
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  // Keyboard
  ctx.fillStyle = KB_BASE
  const kb = v.r(0.5, 13, 14, 3)
  ctx.fillRect(kb.x, kb.y, kb.w, kb.h)

  ctx.fillStyle = KB_KEY
  for (let row = 0; row < 2; row++) {
    const ky = 13.5 + row * 1.2
    for (let col = 0; col < 5; col++) {
      const kx = 1 + col * 2.6
      const key = v.r(kx, ky, 2.0, 0.7)
      ctx.fillRect(key.x, key.y, key.w, key.h)
    }
  }

  // Key flashes
  if (leftHit) {
    const row = leftKeyCol % 2
    const kx = 1 + leftKeyCol * 2.6
    const ky = 13.5 + row * 1.2
    ctx.fillStyle = `rgba(255,255,255,0.9)`
    const key = v.r(kx, ky, 2.0, 0.7)
    ctx.fillRect(key.x, key.y, key.w, key.h)
  }
  if (rightHit) {
    const row = (rightKeyCol - 3) % 2
    const kx = 1 + rightKeyCol * 2.6
    const ky = 13.5 + row * 1.2
    ctx.fillStyle = `rgba(255,255,255,0.9)`
    const key = v.r(kx, ky, 2.0, 0.7)
    ctx.fillRect(key.x, key.y, key.w, key.h)
  }

  // Body
  ctx.fillStyle = BODY_C
  const bScale = 1.0 + breathe * 0.015
  drawBody(ctx, v, dy, bScale, bScale)
  drawMoon(ctx, v, dy)
  drawArms(ctx, v, dy, angleL, angleR)
  drawLegs(ctx, v, dy)
  drawEyes(ctx, v, dy, eyeScale)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ALERT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawAlert(ctx: CanvasRenderingContext2D, sz: number, t: number, alive: boolean) {
  if (alive) {
    const pulse = (Math.sin(t * 2 * Math.PI) + 1) / 2
    const glowR = sz * 0.4 * (0.9 + pulse * 0.1)
    const grad = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, glowR)
    grad.addColorStop(0, `rgba(255, 61, 0, ${0.12 * (0.5 + pulse * 0.5)})`)
    grad.addColorStop(1, 'rgba(255, 61, 0, 0)')
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
      [0.175, -10],
      [0.2, -10],
      [0.25, 1.5],
      [0.275, -8],
      [0.3, -8],
      [0.35, 1.2],
      [0.375, -5],
      [0.4, -5],
      [0.45, 1.0],
      [0.475, -3],
      [0.5, -3],
      [0.55, 0.5],
      [0.62, 0],
      [1.0, 0],
    ],
    pct
  )

  const scaleX = jumpY > 0.5 ? 1.0 + jumpY * 0.05 : 1.0
  const scaleY = jumpY > 0.5 ? 1.0 - jumpY * 0.04 : 1.0

  const armL = lerp(
    [
      [0, 0],
      [0.03, 0],
      [0.1, 25],
      [0.15, 30],
      [0.2, 155],
      [0.25, 115],
      [0.3, 140],
      [0.35, 100],
      [0.4, 115],
      [0.45, 80],
      [0.5, 80],
      [0.55, 40],
      [0.62, 0],
      [1.0, 0],
    ],
    pct
  )
  const armR = -lerp(
    [
      [0, 0],
      [0.03, 0],
      [0.1, 30],
      [0.15, 30],
      [0.2, 155],
      [0.25, 115],
      [0.3, 140],
      [0.35, 100],
      [0.4, 115],
      [0.45, 80],
      [0.5, 80],
      [0.55, 40],
      [0.62, 0],
      [1.0, 0],
    ],
    pct
  )

  const eyeScale = pct > 0.03 && pct < 0.15 ? 1.3 : 1.0
  const eyeDY = pct > 0.03 && pct < 0.15 ? -0.5 : 0

  const bangOpacity = lerp(
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

  const v = makeV(sz, sz, 15, 12, 4)

  // Shadow
  const shadowW = 7 * (1.0 - Math.abs(Math.min(0, jumpY)) * 0.04)
  const shadowOp = Math.max(0.08, 0.4 - Math.abs(Math.min(0, jumpY)) * 0.04)
  drawShadow(ctx, v, shadowW, shadowOp)

  // Body with squash/stretch
  ctx.fillStyle = BODY_C
  drawBody(ctx, v, jumpY, scaleX, scaleY)
  drawMoon(ctx, v, jumpY)
  drawArms(ctx, v, jumpY, armL, armR)
  drawLegs(ctx, v, jumpY)
  drawEyes(ctx, v, jumpY + eyeDY, eyeScale)

  // ! mark
  if (bangOpacity > 0.01) {
    ctx.fillStyle = ALERT_C
    ctx.globalAlpha = bangOpacity
    const bw = 2 * bangScale
    const bx = 12
    const by = 3.5 + jumpY * 0.15
    const top = v.r(bx, by, bw, 3.5 * bangScale, 0)
    const dot = v.r(bx, by + 4.0 * bangScale, bw, 1.5 * bangScale, 0)
    ctx.fillRect(top.x, top.y, top.w, top.h)
    ctx.fillRect(dot.x, dot.y, dot.w, dot.h)
    ctx.globalAlpha = 1.0
  }
}

export function KimiMascot({ size = 28, status = 'idle' }: MascotBaseProps) {
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
