// src/components/ui/SplashScreen.tsx
import { useEffect, useRef } from 'react'

interface SplashScreenProps {
  onDone: () => void
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const cvRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()
  const frameRef = useRef(0)

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const cx = cv.getContext('2d')!
    cv.width = window.innerWidth
    cv.height = window.innerHeight

    const W = () => cv.width
    const H = () => cv.height
    const G = '#C9A84C', GL = '#E8C97A', WH = '#EDE8DE'
    const MU = '#6A6058', BG = '#070708'

    const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3)
    const easeOut5 = (t: number) => 1 - Math.pow(1 - t, 5)
    const easeInOut = (t: number) => t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const lerp = (a: number, b: number, t: number) => a + (b-a)*t

    function stickman(x: number, y: number, sc: number, walk: number, color: string, flip: boolean, armRaise: number, headTilt: number) {
      cx.save()
      cx.translate(x, y)
      if (flip) cx.scale(-1,1)
      cx.scale(sc, sc)
      const lw = 3
      cx.lineCap = 'round'; cx.lineJoin = 'round'
      cx.save()
      cx.globalAlpha = .18
      cx.translate(6, 8); cx.scale(1, .3)
      cx.beginPath(); cx.arc(0, -38, 10, 0, Math.PI*2)
      cx.fillStyle = '#000'; cx.fill()
      cx.restore()
      const ls = Math.sin(walk) * 25
      cx.strokeStyle = color; cx.lineWidth = lw - .5; cx.globalAlpha = .7
      cx.beginPath(); cx.moveTo(0, 0)
      cx.quadraticCurveTo(-ls*.4, 12, -ls, 26); cx.stroke()
      cx.beginPath(); cx.moveTo(0, -18)
      cx.quadraticCurveTo(-10, -10, -20, -5); cx.stroke()
      cx.globalAlpha = 1
      cx.strokeStyle = color; cx.lineWidth = lw
      cx.beginPath(); cx.moveTo(0, -26); cx.lineTo(0, 0); cx.stroke()
      cx.beginPath(); cx.moveTo(0, 0)
      cx.quadraticCurveTo(ls*.4, 12, ls, 26); cx.stroke()
      cx.beginPath(); cx.moveTo(0, -18)
      if (armRaise > 0) {
        cx.quadraticCurveTo(10, -18 - armRaise*8, 18, -26 - armRaise*16)
      } else {
        const as = Math.cos(walk)*20
        cx.quadraticCurveTo(12, -10 - as*.3, 22, -4 - as*.5)
      }
      cx.stroke()
      cx.beginPath(); cx.moveTo(0, -26); cx.lineTo(0, -30); cx.stroke()
      cx.save()
      cx.translate(0, -42); cx.rotate(headTilt || 0)
      cx.beginPath(); cx.arc(0, 0, 11, 0, Math.PI*2)
      cx.strokeStyle = color; cx.lineWidth = lw - .5; cx.stroke()
      cx.fillStyle = BG; cx.fill()
      cx.fillStyle = color
      cx.beginPath(); cx.arc(4, -2, 1.5, 0, Math.PI*2); cx.fill()
      cx.beginPath(); cx.arc(-2, -2, 1, 0, Math.PI*2); cx.fill()
      cx.restore()
      cx.restore()
    }

    function briefcase(x: number, y: number, sc: number, swing: number) {
      cx.save()
      cx.translate(x, y); cx.rotate(swing); cx.scale(sc, sc)
      cx.strokeStyle = G; cx.lineWidth = 2
      cx.beginPath(); cx.arc(0, -18, 8, Math.PI, 0); cx.stroke()
      cx.fillStyle = 'rgba(201,168,76,0.12)'; cx.strokeStyle = G; cx.lineWidth = 2
      cx.beginPath(); cx.roundRect(-22, -14, 44, 32, 3); cx.fill(); cx.stroke()
      cx.beginPath(); cx.moveTo(-22, 1); cx.lineTo(22, 1)
      cx.strokeStyle = 'rgba(201,168,76,0.4)'; cx.lineWidth = 1; cx.stroke()
      cx.fillStyle = GL; cx.font = 'bold 11px sans-serif'
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('★', 0, -3)
      cx.fillStyle = G; cx.beginPath(); cx.arc(0, 1, 3, 0, Math.PI*2); cx.fill()
      cx.restore()
    }

    function moneybag(x: number, y: number, sc: number, swing: number) {
      cx.save()
      cx.translate(x, y); cx.rotate(swing); cx.scale(sc, sc)
      cx.fillStyle = 'rgba(201,168,76,0.15)'; cx.strokeStyle = GL; cx.lineWidth = 2.5
      cx.beginPath(); cx.arc(0, 8, 18, 0, Math.PI*2); cx.fill(); cx.stroke()
      cx.fillStyle = 'rgba(201,168,76,0.15)'; cx.strokeStyle = GL
      cx.beginPath(); cx.moveTo(-7,-9); cx.lineTo(7,-9); cx.lineTo(5,-18); cx.lineTo(-5,-18); cx.closePath(); cx.fill(); cx.stroke()
      cx.beginPath(); cx.arc(0,-8,4,0,Math.PI*2); cx.fillStyle = GL; cx.fill()
      cx.fillStyle = '#0A0A0A'; cx.font = 'bold 15px Georgia,serif'
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('₣', 0, 9)
      cx.strokeStyle = 'rgba(232,201,122,0.4)'; cx.lineWidth = 1.5
      cx.beginPath(); cx.arc(-6, 1, 6, -Math.PI*.7, -Math.PI*.1); cx.stroke()
      cx.restore()
    }

    function rope(x1: number, y1: number, x2: number, y2: number, tension: number) {
      cx.save()
      cx.strokeStyle = 'rgba(201,168,76,0.5)'; cx.lineWidth = 1.5; cx.setLineDash([3,4])
      cx.beginPath(); cx.moveTo(x1,y1)
      cx.quadraticCurveTo((x1+x2)/2, (y1+y2)/2+tension, x2, y2); cx.stroke()
      cx.setLineDash([]); cx.restore()
    }

    function effortParticles(x: number, y: number, amount: number) {
      for (let i=0;i<amount;i++) {
        const px = x + (Math.random()-.5)*30, py = y - Math.random()*40-10
        cx.fillStyle = `rgba(201,168,76,${Math.random()*.4+.1})`
        cx.beginPath(); cx.arc(px,py,Math.random()*2+.5,0,Math.PI*2); cx.fill()
      }
    }

    function dust(x: number, y: number, r: number, alpha: number) {
      cx.save(); cx.globalAlpha = alpha*.3; cx.fillStyle = 'rgba(201,168,76,0.2)'
      for (let i=0;i<3;i++) { cx.beginPath(); cx.arc(x-r*.5+i*r*.4,y+2,r*.4+i*.3,0,Math.PI*2); cx.fill() }
      cx.restore()
    }

    function sparkles(x: number, y: number, t: number, count: number) {
      cx.save()
      for (let i=0;i<count;i++) {
        const angle=(i/count)*Math.PI*2+t*.03
        const dist=20+Math.sin(t*.15+i)*8
        const px=x+Math.cos(angle)*dist, py=y+Math.sin(angle)*dist*.6
        const sz=1.5+Math.sin(t*.2+i*1.3)*.8
        cx.fillStyle = i%2===0?G:GL; cx.globalAlpha=.6+Math.sin(t*.25+i)*.4
        cx.save(); cx.translate(px,py); cx.rotate(t*.04+i)
        cx.beginPath(); cx.moveTo(0,-sz*2); cx.lineTo(sz*.5,0); cx.lineTo(0,sz*2); cx.lineTo(-sz*.5,0); cx.closePath(); cx.fill()
        cx.restore()
      }
      cx.restore()
    }

    function bigG(x: number, y: number, size: number, alpha: number, bloom: number) {
      cx.save(); cx.globalAlpha = clamp(alpha,0,1)
      if (bloom>0) {
        for (let i=3;i>0;i--) {
          cx.globalAlpha=clamp(alpha*bloom*.06*i,0,.2); cx.strokeStyle=G; cx.lineWidth=1
          cx.beginPath(); cx.arc(x,y,size*.7+i*14,0,Math.PI*2); cx.stroke()
        }
      }
      cx.globalAlpha = clamp(alpha,0,1)
      cx.save(); cx.translate(x,y); cx.rotate(Math.PI*.25)
      const ds=size*.58; cx.strokeStyle=`rgba(201,168,76,${alpha*.7})`; cx.lineWidth=1.5
      cx.strokeRect(-ds,-ds,ds*2,ds*2); cx.rotate(-Math.PI*.25)
      cx.font=`300 ${size}px "Cormorant Garamond",Georgia,serif`
      cx.fillStyle=G; cx.textAlign='center'; cx.textBaseline='middle'; cx.fillText('G',0,size*.06)
      cx.restore()
      if (alpha>.6) {
        const ta=(alpha-.6)/.4; cx.globalAlpha=ta; cx.fillStyle=GL
        cx.font=`${size*.13}px sans-serif`; cx.textAlign='center'; cx.textBaseline='middle'
        cx.fillText('GOLDEN  INVESTISSEMENT', x, y+size*.55)
      }
      cx.restore()
    }

    function loadBar(progress: number, alpha: number) {
      const bw=Math.min(220,W()*.4), bx=W()/2-bw/2, by=H()-36
      cx.save(); cx.globalAlpha=alpha
      cx.fillStyle='rgba(201,168,76,0.08)'; cx.strokeStyle='rgba(201,168,76,0.2)'; cx.lineWidth=1
      cx.beginPath(); cx.roundRect(bx,by,bw,3,1.5); cx.fill(); cx.stroke()
      if (progress>0) { cx.fillStyle=G; cx.beginPath(); cx.roundRect(bx,by,bw*progress,3,1.5); cx.fill() }
      cx.fillStyle=MU; cx.font='9px sans-serif'; cx.textAlign='center'
      cx.fillText('CHARGEMENT', W()/2, by-10)
      cx.restore()
    }

    function label(txt: string, x: number, y: number, alpha: number) {
      cx.save(); cx.globalAlpha=alpha; cx.fillStyle=MU; cx.font='10px sans-serif'; cx.textAlign='center'
      cx.fillText(txt, x, y); cx.restore()
    }

    function drawBg() {
      cx.fillStyle=BG; cx.fillRect(0,0,W(),H())
      const vig=cx.createRadialGradient(W()/2,H()/2,H()*.1,W()/2,H()/2,H()*.8)
      vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.55)')
      cx.fillStyle=vig; cx.fillRect(0,0,W(),H())
    }

    function ground(gy: number) {
      const grd=cx.createLinearGradient(0,gy,W(),gy)
      grd.addColorStop(0,'rgba(201,168,76,0)'); grd.addColorStop(.3,'rgba(201,168,76,0.15)')
      grd.addColorStop(.7,'rgba(201,168,76,0.15)'); grd.addColorStop(1,'rgba(201,168,76,0)')
      cx.strokeStyle=grd; cx.lineWidth=1
      cx.beginPath(); cx.moveTo(0,gy); cx.lineTo(W(),gy); cx.stroke()
    }

    function loop() {
      frameRef.current++
      const f = frameRef.current
      const w = W(), h = H()
      const GY = h * .68

      drawBg()
      ground(GY)

      if (f <= 100) {
        const prog = clamp(f/100,0,1)
        const px = lerp(-60, w*.35, easeOut3(prog))
        const walk = f*.22
        const caseX = px-58, caseY = GY-6
        rope(px-28,GY-20,caseX+22,caseY-8,8)
        briefcase(caseX,caseY,1,Math.sin(f*.18)*.06)
        stickman(px,GY,1,walk,G,false,0,-.06)
        if (f>15) dust(caseX-10,GY+2,18,.7)
        if (f%6<3&&f>10) effortParticles(px-5,GY-55,2)
        label('Porteur de projet',px,GY+22,Math.min(1,(f-10)/20))
      }

      if (f>=60&&f<=160) {
        const prog=clamp((f-60)/100,0,1)
        const ix=lerp(w+60,w*.65,easeOut3(prog))
        const walk=f*.2
        moneybag(ix+32,GY-52,1,Math.sin(f*.14)*.15)
        stickman(ix,GY,1,-walk,GL,true,Math.min(1,(f-60)/40)*.3,.06)
        if (f>80) dust(ix+12,GY+2,14,.5)
        label('Investisseur',ix,GY+22,Math.min(1,(f-70)/20))
      }

      if (f>=100&&f<=160) {
        const pp=clamp((f-100)/60,0,1)
        const px=lerp(w*.35,w*.42,easeInOut(pp))
        const caseX=px-58, caseY=GY-6
        rope(px-28,GY-20,caseX+22,caseY-8,6)
        briefcase(caseX,caseY,1,Math.sin(f*.18)*.04)
        stickman(px,GY,1,f*.22,G,false,0,-.05)
        label('Porteur de projet',px,GY+22,1)
        const ix=lerp(w*.65,w*.58,easeInOut(pp))
        moneybag(ix+32,GY-52,1,Math.sin(f*.14)*.1)
        stickman(ix,GY,1,-(f*.2),GL,true,.4,.05)
        label('Investisseur',ix,GY+22,1)
      }

      if (f>=160&&f<=220) {
        const pp=clamp((f-160)/60,0,1)
        const px=lerp(w*.42,w*.38,easeOut3(pp))
        const ix=lerp(w*.58,w*.62,easeOut3(pp))
        const armR=easeOut3(clamp((f-165)/30,0,1))
        const caseX=px-52, caseY=GY-4
        rope(px-24,GY-18,caseX+22,caseY-8,5)
        briefcase(caseX,caseY,1,Math.sin(f*.1)*.03)
        stickman(px,GY,1,0,G,false,armR,Math.sin(f*.08)*.05)
        label('Porteur de projet',px,GY+22,1)
        moneybag(ix+28,GY-50-armR*10,1,Math.sin(f*.12)*.05)
        stickman(ix,GY,1,0,GL,true,armR,-Math.sin(f*.08)*.05)
        label('Investisseur',ix,GY+22,1)
        if (armR>.5) { sparkles((px+ix)/2,GY-38-armR*16,f,8) }
      }

      if (f>=220&&f<=320) {
        const fadeOut=clamp(1-(f-220)/50,0,1)
        const px=w*.38, ix=w*.62
        cx.save(); cx.globalAlpha=fadeOut
        briefcase(px-52,GY-4,1,0)
        rope(px-24,GY-18,px-52+22,GY-12,4)
        stickman(px,GY,1,0,G,false,1,0)
        moneybag(ix+28,GY-60,1,0)
        stickman(ix,GY,1,0,GL,true,1,0)
        cx.restore()
        if (fadeOut>0) {
          label('Porteur de projet',px,GY+22,fadeOut)
          label('Investisseur',ix,GY+22,fadeOut)
          sparkles(w/2,GY-60,f,10)
        }
        const gp=clamp((f-230)/60,0,1)
        const ge=easeOut5(gp)
        bigG(w/2, lerp(GY-60,h*.32,ge), lerp(20,90,ge), clamp((f-225)/30,0,1), clamp((f-270)/30,0,1))
      }

      if (f>=320&&f<=430) {
        bigG(w/2,h*.32,90,1,1)
        loadBar(easeInOut(clamp((f-330)/70,0,1)), clamp((f-320)/20,0,1))
        if (f>410) {
          const fa=clamp((f-410)/20,0,1)
          cx.save(); cx.globalAlpha=fa; cx.fillStyle=BG; cx.fillRect(0,0,W(),H()); cx.restore()
          if (fa>=0.99) { onDone(); return }
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#070708',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <canvas ref={cvRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
