declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number
    spread?: number
    origin?: { x?: number; y?: number }
    colors?: string[]
    shapes?: string[]
    scalar?: number
    startVelocity?: number
    gravity?: number
    drift?: number
    ticks?: number
  }

  function confetti(options?: ConfettiOptions): Promise<void>
  export = confetti
}
