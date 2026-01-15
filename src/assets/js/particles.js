class Particles {
  constructor(options = {}) {
    this.className = options.className || ""
    this.quantity = options.quantity || 100
    this.staticity = options.staticity || 50
    this.ease = options.ease || 50
    this.size = options.size || 0.4
    this.color = options.color || "#ffffff"
    this.vx = options.vx || 0
    this.vy = options.vy || 0

    this.canvasRef = null
    this.canvasContainerRef = null
    this.context = null
    this.circles = []
    this.mouse = { x: 0, y: 0 }
    this.canvasSize = { w: 0, h: 0 }
    this.dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
    this.animationId = null
  }

  hexToRgb(hex) {
    hex = hex.replace("#", "")

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    }

    const hexInt = parseInt(hex, 16)
    const red = (hexInt >> 16) & 255
    const green = (hexInt >> 8) & 255
    const blue = hexInt & 255
    return [red, green, blue]
  }

  createParticles(container) {
    this.canvasContainerRef = container
    this.canvasRef = document.createElement("canvas")
    this.canvasRef.className = "size-full"
    this.canvasRef.style.display = "block"
    container.appendChild(this.canvasRef)
    this.context = this.canvasRef.getContext("2d")

    this.initCanvas()
    this.animate()
    window.addEventListener("resize", () => this.initCanvas())
    window.addEventListener("mousemove", (e) => this.onMouseMove(e))
  }

  initCanvas = () => {
    this.resizeCanvas()
    this.drawParticles()
  }

  onMouseMove = (event) => {
    if (this.canvasRef) {
      const rect = this.canvasRef.getBoundingClientRect()
      const { w, h } = this.canvasSize
      const x = event.clientX - rect.left - w / 2
      const y = event.clientY - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        this.mouse.x = x
        this.mouse.y = y
      }
    }
  }

  resizeCanvas = () => {
    if (
      this.canvasContainerRef &&
      this.canvasRef &&
      this.context
    ) {
      this.circles.length = 0
      this.canvasSize.w = this.canvasContainerRef.offsetWidth
      this.canvasSize.h = this.canvasContainerRef.offsetHeight
      this.canvasRef.width = this.canvasSize.w * this.dpr
      this.canvasRef.height = this.canvasSize.h * this.dpr
      this.canvasRef.style.width = `${this.canvasSize.w}px`
      this.canvasRef.style.height = `${this.canvasSize.h}px`
      this.context.scale(this.dpr, this.dpr)
    }
  }

  circleParams = () => {
    const x = Math.floor(Math.random() * this.canvasSize.w)
    const y = Math.floor(Math.random() * this.canvasSize.h)
    const translateX = 0
    const translateY = 0
    const pSize = Math.floor(Math.random() * 2) + this.size
    const alpha = 0
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.1
    const dy = (Math.random() - 0.5) * 0.1
    const magnetism = 0.1 + Math.random() * 4
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    }
  }

  drawCircle = (circle, update = false) => {
    if (this.context) {
      const { x, y, translateX, translateY, size, alpha } = circle
      const rgb = this.hexToRgb(this.color)
      this.context.translate(translateX, translateY)
      this.context.beginPath()
      this.context.arc(x, y, size, 0, 2 * Math.PI)
      this.context.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
      this.context.fill()
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

      if (!update) {
        this.circles.push(circle)
      }
    }
  }

  clearContext = () => {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
    }
  }

  drawParticles = () => {
    this.clearContext()
    const particleCount = this.quantity
    for (let i = 0; i < particleCount; i++) {
      const circle = this.circleParams()
      this.drawCircle(circle)
    }
  }

  remapValue = (
    value,
    start1,
    end1,
    start2,
    end2,
  ) => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }

  animate = () => {
    this.clearContext()
    this.circles.forEach((circle, i) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        this.canvasSize.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        this.canvasSize.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = parseFloat(
        this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      )
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge
      }
      circle.x += circle.dx + this.vx
      circle.y += circle.dy + this.vy
      circle.translateX +=
        (this.mouse.x / (this.staticity / circle.magnetism) - circle.translateX) /
        this.ease
      circle.translateY +=
        (this.mouse.y / (this.staticity / circle.magnetism) - circle.translateY) /
        this.ease

      this.drawCircle(circle, true)

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > this.canvasSize.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > this.canvasSize.h + circle.size
      ) {
        // remove the circle from the array
        this.circles.splice(i, 1)
        // create a new circle
        const newCircle = this.circleParams()
        this.drawCircle(newCircle)
        // update the circle position
      }
    })
    this.animationId = window.requestAnimationFrame(this.animate)
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener("resize", this.initCanvas)
    window.removeEventListener("mousemove", this.onMouseMove)
    if (this.canvasRef && this.canvasRef.parentNode) {
      this.canvasRef.parentNode.removeChild(this.canvasRef)
    }
  }
}
