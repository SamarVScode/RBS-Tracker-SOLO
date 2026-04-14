# ANIMATION — FRAMER MOTION v11
> Read by: component-forge, design-system, ui-refiner

## REDUCED MOTION (CHECK FIRST)
```typescript
const prefersReduced = useReducedMotion();
const variants = { hidden: { opacity:0, y: prefersReduced ? 0 : 12 }, visible: { opacity:1, y:0 } };
```

## ENTER/EXIT
```tsx
<AnimatePresence mode="wait">
  {visible && <motion.div key="c" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.12,ease:[0.4,0,0.2,1]}} />}
</AnimatePresence>
```

## LIST STAGGER
```tsx
const container = { hidden:{}, visible:{transition:{staggerChildren:0.06,delayChildren:0.1}} };
const item = { hidden:{opacity:0,y:12}, visible:{opacity:1,y:0,transition:{type:'spring',stiffness:400,damping:30}} };
```

## MICRO
```tsx
<motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} transition={{type:'spring',stiffness:500,damping:35}} style={{willChange:'transform'}} />
```

## CHOREOGRAPHY PRESETS (for design-contract.json)
```json
{
  "pageEnter":     { "type":"fadeSlideUp",   "duration":"250ms", "easing":"decelerate", "impl":"opacity 0→1, translateY 12px→0" },
  "listItemEnter": { "type":"staggerFadeIn", "staggerDelay":"40ms/item max 200ms", "duration":"200ms" },
  "cardHover":     { "type":"elevate",       "duration":"150ms", "easing":"standard",   "impl":"translateY -2px, shadow md→lg" },
  "buttonPress":   { "type":"scale",         "duration":"80ms",  "impl":"scale 1→0.96 on press" },
  "modalEnter":    { "type":"fadeScaleIn",   "duration":"200ms", "easing":"decelerate", "impl":"opacity 0→1, scale 0.94→1" },
  "skeleton":      { "type":"shimmer",       "duration":"1500ms","impl":"linear-gradient sweep, infinite" },
  "errorShake":    { "type":"shake",         "duration":"400ms", "impl":"translateX 0→-8→8→-4→4→0" },
  "successPulse":  { "type":"pulse",         "duration":"600ms", "impl":"scale 1→1.04→1" }
}
```

## RULES
- `willChange:'transform'` on animated elements | Never animate width/height/top/left — use `layout`
- Exit < enter (150ms vs 200ms) | Max 240ms on interactives | Always useReducedMotion fallback
