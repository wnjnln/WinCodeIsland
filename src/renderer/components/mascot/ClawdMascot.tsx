import { useMascotAnimation, makeV, armPath, lerp, drawZs, type MascotBaseProps } from './utils'

// Colors from CodeIsland ClawdView
const BODY_C = '#DE886D'
const EYE_C = '#000000'
const ALERT_C = '#FF3D00'
const KB_BASE = '#607080'
const KB_KEY = '#99A8B8'
const KB_HI = '#FFFFFF'

function draw(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  status: 'idle' | 'processing' | 'waiting',
  alive: boolean
) {
  ctx.clearRect(0, 0, size, size)
  switch (status) {
    case 'idle':
      drawSleeping(ctx, size, t)
      break
    case 'processing':
      drawWork(ctx, size, t)
      break
    case 'waiting':
      drawAlert(ctx, size, t, alive)
      break
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLEEP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawSleeping(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 17, 7, 9)
  const phase = (t % 4.5) / 4.5
  const breathe = phase < 0.4 ? Math.sin((phase / 0.4) * Math.PI) : 0

  // Shadow
  const shadowScale = 1.0 + breathe * 0.03
  const sh = v.r(-1, 15, 17 * shadowScale, 1)
  ctx.fillStyle = `rgba(0,0,0,${0.35 + breathe * 0.08})`
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  // Legs
  ctx.fillStyle = BODY_C
  for (const x of [3, 5, 9, 11]) {
    const leg = v.r(x, 8.5, 1, 1.5)
    ctx.fillRect(leg.x, leg.y, leg.w, leg.h)
  }

  // Torso
  const puff = Math.max(0, breathe) * 0.25
  const torsoH = 5 * (1.0 + puff)
  const torsoY = 15 - torsoH
  const torsoW = 13 * (1.0 + breathe * 0.015)
  const torsoX = 1 - (torsoW - 13) / 2
  const torso = v.r(torsoX, torsoY, torsoW, torsoH)
  ctx.fillRect(torso.x, torso.y, torso.w, torso.h)

  // Arms
  const armL = v.r(-1, 13, 2, 2)
  ctx.fillRect(armL.x, armL.y, armL.w, armL.h)
  const armR = v.r(14, 13, 2, 2)
  ctx.fillRect(armR.x, armR.y, armR.w, armR.h)

  // Eyes
  ctx.fillStyle = EYE_C
  const eyeY = 12.2 - puff * 2.5
  const eye1 = v.r(3, eyeY, 2.5, 1.0)
  ctx.fillRect(eye1.x, eye1.y, eye1.w, eye1.h)
  const eye2 = v.r(9.5, eyeY, 2.5, 1.0)
  ctx.fillRect(eye2.x, eye2.y, eye2.w, eye2.h)

  // Floating Z's
  drawZs(ctx, sz, t)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WORK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function drawWork(ctx: CanvasRenderingContext2D, sz: number, t: number) {
  const v = makeV(sz, sz, 16, 11, 5.5)
  const bounce = Math.sin(t * 2 * Math.PI / 0.35) * 1.2
  const breathe = Math.sin(t * 2 * Math.PI / 3.2)

  const armLRaw = Math.sin(t * 2 * Math.PI / 0.15)
  const armL = armLRaw * 22.5 - 32.5
  const armRRaw = Math.sin(t * 2 * Math.PI / 0.12)
  const armR = armRRaw * 22.5 + 32.5

  const leftHit = armLRaw > 0.3
  const rightHit = armRRaw > 0.3
  const leftKeyCol = Math.floor(t / 0.15) % 3
  const rightKeyCol = 3 + Math.floor(t / 0.12) % 3

  const scanPhase = t % 10.0
  const eyeScale = scanPhase > 5.7 && scanPhase < 6.9 ? 1.0 : 0.5
  const eyeDY = eyeScale < 0.8 ? 1.0 : -0.5
  const blinkPhase = t % 3.5
  const finalEyeScale = blinkPhase > 1.4 && blinkPhase < 1.55 ? 0.1 : eyeScale

  const dy = bounce

  // 1. Shadow
  const shadowW = 9 - Math.abs(dy) * 0.3
  const sh = v.r(3 + (9 - shadowW) / 2, 15, shadowW, 1)
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.1, 0.4 - Math.abs(dy) * 0.03)})`
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  // 2. Legs
  ctx.fillStyle = BODY_C
  for (const x of [3, 5, 9, 11]) {
    const leg = v.r(x, 13, 1, 2)
    ctx.fillRect(leg.x, leg.y, leg.w, leg.h)
  }

  // 3. Torso
  const bScale = 1.0 + breathe * 0.015
  const torsoW = 11 * bScale
  const torso = v.r(2 - (torsoW - 11) / 2, 6, torsoW, 7, dy)
  ctx.fillRect(torso.x, torso.y, torso.w, torso.h)

  // 4. Eyes
  const eyeH = 2 * finalEyeScale
  const eyeY = 8 + (2 - eyeH) / 2 + eyeDY
  ctx.fillStyle = EYE_C
  const eye1 = v.r(4, eyeY, 1, eyeH, dy)
  ctx.fillRect(eye1.x, eye1.y, eye1.w, eye1.h)
  const eye2 = v.r(10, eyeY, 1, eyeH, dy)
  ctx.fillRect(eye2.x, eye2.y, eye2.w, eye2.h)

  // 5. Keyboard
  const kb = v.r(-0.5, 11.8, 16, 3.5)
  ctx.fillStyle = KB_BASE
  ctx.fillRect(kb.x, kb.y, kb.w, kb.h)

  // Keys
  ctx.fillStyle = KB_KEY
  for (let row = 0; row < 3; row++) {
    const ky = 12.2 + row * 1.0
    for (let col = 0; col < 6; col++) {
      const kx = 0.3 + col * 2.5
      const w = col === 2 && row === 1 ? 4.5 : 2.0
      const key = v.r(kx, ky, w, 0.7)
      ctx.fillRect(key.x, key.y, key.w, key.h)
    }
  }

  // Key flashes
  if (leftHit) {
    const row = leftKeyCol % 3
    const kx = 0.3 + leftKeyCol * 2.5
    const ky = 12.2 + row * 1.0
    const key = v.r(kx, ky, 2.0, 0.7)
    ctx.fillStyle = KB_HI
    ctx.globalAlpha = 0.9
    ctx.fillRect(key.x, key.y, key.w, key.h)
    ctx.globalAlpha = 1.0
  }
  if (rightHit) {
    const row = (rightKeyCol - 3) % 3
    const kx = 0.3 + rightKeyCol * 2.5
    const ky = 12.2 + row * 1.0
    const key = v.r(kx, ky, 2.0, 0.7)
    ctx.fillStyle = KB_HI
    ctx.globalAlpha = 0.9
    ctx.fillRect(key.x, key.y, key.w, key.h)
    ctx.globalAlpha = 1.0
  }

  // 6. Arms
  ctx.fillStyle = BODY_C
  ctx.fill(armPath(v, 0, 9, 2, 2, 2, 10, armL, dy))
  ctx.fill(armPath(v, 13, 9, 2, 2, 13, 10, armR, dy))
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
  const shadowW = 9 * (1.0 - Math.abs(Math.min(0, jumpY)) * 0.04)
  const shadowOp = Math.max(0.08, 0.5 - Math.abs(Math.min(0, jumpY)) * 0.04)
  const sh = v.r(3 + (9 - shadowW) / 2, 15, shadowW, 1)
  ctx.fillStyle = `rgba(0,0,0,${shadowOp})`
  ctx.fillRect(sh.x, sh.y, sh.w, sh.h)

  // Legs
  ctx.fillStyle = BODY_C
  for (const x of [3, 5, 9, 11]) {
    const leg = v.r(x, 11, 1, 4)
    ctx.fillRect(leg.x, leg.y, leg.w, leg.h)
  }

  // Torso with squash/stretch
  const torsoW = 11 * scaleX
  const torsoH = 7 * scaleY
  const torsoX = 2 - (torsoW - 11) / 2
  const torsoY = 6 + (7 - torsoH)
  const torso = v.r(torsoX, torsoY, torsoW, torsoH, jumpY)
  ctx.fillRect(torso.x, torso.y, torso.w, torso.h)

  // Eyes
  const eyeH = 2 * eyeScale
  const eyeYPos = 8 + (2 - eyeH) / 2 + eyeDY
  ctx.fillStyle = EYE_C
  const eye1 = v.r(4, eyeYPos, 1, eyeH, jumpY)
  ctx.fillRect(eye1.x, eye1.y, eye1.w, eye1.h)
  const eye2 = v.r(10, eyeYPos, 1, eyeH, jumpY)
  ctx.fillRect(eye2.x, eye2.y, eye2.w, eye2.h)

  // Arms
  ctx.fillStyle = BODY_C
  ctx.fill(armPath(v, 0, 9, 2, 2, 2, 10, armL, jumpY))
  ctx.fill(armPath(v, 13, 9, 2, 2, 13, 10, armR, jumpY))

  // ! mark
  if (bangOpacity > 0.01) {
    ctx.fillStyle = ALERT_C
    ctx.globalAlpha = bangOpacity
    const bw = 2 * bangScale
    const bx = 13
    const by = 4.5 + jumpY * 0.15
    const top = v.r(bx, by, bw, 3.5 * bangScale, 0)
    const dot = v.r(bx, by + 4.0 * bangScale, bw, 1.5 * bangScale, 0)
    ctx.fillRect(top.x, top.y, top.w, top.h)
    ctx.fillRect(dot.x, dot.y, dot.w, dot.h)
    ctx.globalAlpha = 1.0
  }
}

export function ClawdMascot({ size = 28, status = 'idle' }: MascotBaseProps) {
  const canvasRef = useMascotAnimation(status, (ctx, sz, t, alive) => {
    draw(ctx, sz, t, status, alive)
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
