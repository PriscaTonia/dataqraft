"use client"

import { useEffect, useRef } from "react"

type Node = { x: number; y: number; vx: number; vy: number }

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let running = true
    const nodes: Node[] = []

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * ratio))
      canvas.height = Math.max(1, Math.floor(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (nodes.length === 0) {
        const count = width < 768 ? 22 : 36
        for (let i = 0; i < count; i += 1) {
          nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
          })
        }
      }
    }

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      context.clearRect(0, 0, width, height)
      const signal = getComputedStyle(document.documentElement)
        .getPropertyValue("--signal")
        .trim()
      context.fillStyle = signal
      context.strokeStyle = signal

      for (const node of nodes) {
        if (!reduce.matches) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
        }
        context.globalAlpha = 0.45
        context.beginPath()
        context.arc(node.x, node.y, 1.4, 0, Math.PI * 2)
        context.fill()
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 150) {
            context.globalAlpha = (1 - dist / 150) * 0.22
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }
      }
      context.globalAlpha = 1
    }

    const tick = () => {
      if (!running) return
      draw()
      if (!reduce.matches) frame = window.requestAnimationFrame(tick)
    }

    resize()
    tick()

    const onResize = () => {
      nodes.length = 0
      resize()
      draw()
    }
    window.addEventListener("resize", onResize)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        window.cancelAnimationFrame(frame)
      } else if (!reduce.matches) {
        running = true
        tick()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
