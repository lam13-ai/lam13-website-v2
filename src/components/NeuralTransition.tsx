import { useEffect, useRef } from "react";

const NeuralTransition = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 8;

    // Background particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; hue: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 20 + 180, // Cyan to teal range
      });
    }

    let animationId: number;
    let time = 0;
    let rotation = 0;

    const drawRobotPart = (
      x: number,
      y: number,
      width: number,
      height: number,
      baseColor: string,
      highlightIntensity: number,
      roundness: number,
      angle: number,
      isMetallic: boolean = true
    ) => {
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(angle);
      
      // Deep shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 8 * Math.cos(rotation + Math.PI * 0.75);
      ctx.shadowOffsetY = 8 * Math.sin(rotation + Math.PI * 0.75);

      // Base metallic gradient
      const metalGradient = ctx.createLinearGradient(
        -width/2, -height/2,
        width/2, height/2
      );
      metalGradient.addColorStop(0, 'rgba(20, 30, 45, 0.85)');
      metalGradient.addColorStop(0.3, 'rgba(10, 80, 95, 0.7)');
      metalGradient.addColorStop(0.7, 'rgba(0, 120, 135, 0.6)');
      metalGradient.addColorStop(1, 'rgba(15, 40, 55, 0.8)');
      
      ctx.fillStyle = metalGradient;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, roundness);
      ctx.fill();
      
      ctx.shadowColor = 'transparent';

      // Metallic highlight on top-left
      if (isMetallic) {
        const highlightGradient = ctx.createLinearGradient(
          -width/3, -height/3,
          width/4, height/4
        );
        highlightGradient.addColorStop(0, `rgba(24, 209, 255, ${highlightIntensity * 0.5})`);
        highlightGradient.addColorStop(0.4, `rgba(24, 209, 255, ${highlightIntensity * 0.25})`);
        highlightGradient.addColorStop(1, 'rgba(24, 209, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.roundRect(-width / 2, -height / 2, width, height, roundness);
        ctx.fill();
      }

      // Edge lighting
      ctx.strokeStyle = `rgba(24, 209, 255, ${highlightIntensity * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, roundness);
      ctx.stroke();

      // Inner shadow for depth
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-width / 2 + 3, -height / 2 + 3, width - 6, height - 6, roundness - 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawGlowingEye = (x: number, y: number, size: number, intensity: number) => {
      // Outer glow
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      outerGlow.addColorStop(0, `rgba(24, 209, 255, ${intensity * 0.6})`);
      outerGlow.addColorStop(0.5, `rgba(24, 209, 255, ${intensity * 0.3})`);
      outerGlow.addColorStop(1, 'rgba(24, 209, 255, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      const innerGlow = ctx.createRadialGradient(x, y, 0, x, y, size);
      innerGlow.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
      innerGlow.addColorStop(0.3, `rgba(24, 209, 255, ${intensity})`);
      innerGlow.addColorStop(1, `rgba(0, 163, 168, ${intensity * 0.5})`);
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRobot = () => {
      const bobbing = Math.sin(time * 1.5) * 8;
      const glowIntensity = 0.7 + Math.sin(time * 2) * 0.3;
      
      // Perspective tilt based on rotation
      const tiltX = Math.sin(rotation) * 15;
      const tiltY = Math.cos(rotation) * 8;

      // Head
      const headWidth = scale * 1.3;
      const headHeight = scale;
      const headX = centerX + tiltX;
      const headY = centerY - scale * 1.8 + bobbing;

      drawRobotPart(
        headX - headWidth / 2,
        headY,
        headWidth,
        headHeight,
        'head',
        0.8 + glowIntensity * 0.2,
        12,
        0,
        true
      );

      // Visor line
      ctx.strokeStyle = `rgba(24, 209, 255, ${glowIntensity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(headX - headWidth * 0.4, headY + headHeight * 0.35);
      ctx.lineTo(headX + headWidth * 0.4, headY + headHeight * 0.35);
      ctx.stroke();

      // Eyes with dynamic positioning based on rotation
      const eyeOffset = Math.sin(rotation) * 10;
      drawGlowingEye(
        headX - scale * 0.3 + eyeOffset,
        headY + headHeight * 0.4,
        scale * 0.12,
        glowIntensity
      );
      drawGlowingEye(
        headX + scale * 0.3 + eyeOffset,
        headY + headHeight * 0.4,
        scale * 0.12,
        glowIntensity
      );

      // Antenna with floating orb
      const antennaHeight = scale * 0.5;
      const antennaTipY = headY - antennaHeight + Math.sin(time * 3) * 6;
      
      ctx.strokeStyle = `rgba(24, 209, 255, 0.6)`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(headX, antennaTipY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Antenna orb
      const orbGradient = ctx.createRadialGradient(headX, antennaTipY, 0, headX, antennaTipY, scale * 0.15);
      orbGradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity})`);
      orbGradient.addColorStop(0.4, `rgba(24, 209, 255, ${glowIntensity * 0.8})`);
      orbGradient.addColorStop(1, 'rgba(24, 209, 255, 0)');
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(headX, antennaTipY, scale * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Neck
      drawRobotPart(
        headX - scale * 0.2,
        headY + headHeight,
        scale * 0.4,
        scale * 0.25,
        'neck',
        0.7,
        6,
        0,
        true
      );

      // Body
      const bodyWidth = scale * 1.6;
      const bodyHeight = scale * 1.3;
      const bodyX = centerX + tiltX;
      const bodyY = headY + headHeight + scale * 0.25 + bobbing * 0.5;

      drawRobotPart(
        bodyX - bodyWidth / 2,
        bodyY,
        bodyWidth,
        bodyHeight,
        'body',
        0.8 + glowIntensity * 0.2,
        16,
        0,
        true
      );

      // Chest core reactor
      const coreSize = scale * 0.4;
      const coreGradient = ctx.createRadialGradient(bodyX, bodyY + bodyHeight * 0.35, 0, bodyX, bodyY + bodyHeight * 0.35, coreSize);
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity * 0.8})`);
      coreGradient.addColorStop(0.3, `rgba(24, 209, 255, ${glowIntensity * 0.7})`);
      coreGradient.addColorStop(0.6, `rgba(0, 163, 168, ${glowIntensity * 0.5})`);
      coreGradient.addColorStop(1, 'rgba(0, 163, 168, 0.1)');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(bodyX, bodyY + bodyHeight * 0.35, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Core rings
      for (let i = 0; i < 3; i++) {
        const ringSize = coreSize * (0.5 + i * 0.2);
        const ringAlpha = (0.8 - i * 0.2) * glowIntensity;
        ctx.strokeStyle = `rgba(24, 209, 255, ${ringAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bodyX, bodyY + bodyHeight * 0.35, ringSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Arms - both stationary
      const armSwing = Math.sin(time) * 0.1;
      const leftArmAngle = armSwing - Math.sin(rotation) * 0.3;
      const rightArmAngle = -armSwing + Math.sin(rotation) * 0.3;

      // Left arm
      drawRobotPart(
        bodyX - bodyWidth * 0.5 - scale * 0.35,
        bodyY + scale * 0.2,
        scale * 0.35,
        scale * 1.1,
        'arm',
        0.65,
        10,
        leftArmAngle,
        true
      );

      // Right arm
      drawRobotPart(
        bodyX + bodyWidth * 0.5,
        bodyY + scale * 0.2,
        scale * 0.35,
        scale * 1.1,
        'arm',
        0.65,
        10,
        rightArmAngle,
        true
      );

      // Speech bubble - adjusted position
      const bubbleX = headX + headWidth * 0.6;
      const bubbleY = headY - scale * 0.8;
      const bubbleWidth = scale * 1.3;
      const bubbleHeight = scale * 0.65;

      // Bubble shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // Bubble background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = `rgba(24, 209, 255, ${0.8 + glowIntensity * 0.2})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 15);
      ctx.fill();
      ctx.stroke();

      // Bubble pointer (triangle pointing to head)
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.moveTo(bubbleX + bubbleWidth * 0.2, bubbleY + bubbleHeight);
      ctx.lineTo(headX + headWidth * 0.5, headY + headHeight * 0.2);
      ctx.lineTo(bubbleX + bubbleWidth * 0.4, bubbleY + bubbleHeight);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = `rgba(24, 209, 255, ${0.8 + glowIntensity * 0.2})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // "Hello" text
      ctx.fillStyle = 'rgba(24, 209, 255, 1)';
      ctx.font = `bold ${scale * 0.38}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Hello!', bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);

      ctx.shadowColor = 'transparent';

      // Legs
      const legOffset = tiltY * 0.3;

      // Left leg
      drawRobotPart(
        bodyX - scale * 0.5,
        bodyY + bodyHeight + legOffset,
        scale * 0.45,
        scale * 0.9,
        'leg',
        0.7,
        10,
        0,
        true
      );

      // Right leg
      drawRobotPart(
        bodyX + scale * 0.05,
        bodyY + bodyHeight - legOffset,
        scale * 0.45,
        scale * 0.9,
        'leg',
        0.7,
        10,
        0,
        true
      );
    };

    const animate = () => {
      // Smooth gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      bgGradient.addColorStop(0, 'rgba(10, 27, 43, 0.95)');
      bgGradient.addColorStop(0.5, 'rgba(0, 163, 168, 0.08)');
      bgGradient.addColorStop(1, 'rgba(10, 27, 43, 0.98)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.015;
      rotation += 0.005; // Slow continuous rotation

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const alpha = 0.3 + Math.sin(time * 2 + particle.x * 0.01) * 0.2;
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        particleGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 65%, ${alpha})`);
        particleGradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      particles.forEach((p1, i) => {
        particles.forEach((p2, j) => {
          if (i < j) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              ctx.strokeStyle = `rgba(24, 209, 255, ${(1 - distance / 120) * 0.15})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });

      drawRobot();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="relative h-[55vh] overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </section>
  );
};

export default NeuralTransition;
