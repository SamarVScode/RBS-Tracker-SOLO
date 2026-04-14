# DESIGN TOKENS SPEC
> Canonical token reference. Read by: component-forge, design-system.
> Run `cat .claude/DESIGN_TOKENS.md` to load this spec.

## SPACING (8px base grid)
space.1=4 | space.2=8 | space.3=12 | space.4=16 | space.5=20 | space.6=24 | space.8=32 | space.10=40 | space.12=48 | space.16=64

## RADIUS
none(0) / sm(4px) / md(8px) / lg(12px) / xl(16px) / 2xl(24px) / full(9999px)

## TYPOGRAPHY — fluid via clamp()
xs:clamp(11px,1.2vw,12px) | sm:clamp(13px,1.4vw,14px) | base:clamp(15px,1.6vw,16px)
lg:clamp(17px,1.8vw,18px) | xl:clamp(19px,2vw,20px) | 2xl:clamp(22px,2.4vw,24px) | 3xl:clamp(28px,3vw,32px)
Weight: 400/500/600/700 | Line-height: tight(1.25)/normal(1.5)/relaxed(1.75)

## COLOR SEMANTIC CSS VARS (never raw hex in components)
bg / surface / surfaceFloating / surfaceOverlay / surfaceModal
primary / primaryHover / primaryActive / primarySubtle
text / textMuted / textDisabled / textInverse
border / borderStrong / borderFocus
success/warning/error/info + subtle variants

## DARK MODE
Light: bg(#fff) surface(#f8f9fa) text(#0f172a) border(#e2e8f0)
Dark:  bg(#0a0a0f) surface(#111118) surfaceFloat(#1a1a24) text(#f1f5f9) border(#1e293b)
Set via [data-theme="dark"] on :root. All colors via CSS vars. No pure black.

## MOTION DURATIONS (ms)
instant:80 | fast:120 | base:180 | slow:240 | enter:200 | exit:150

## MOTION EASING
standard:cubic-bezier(0.4,0,0.2,1) | emphasized:cubic-bezier(0.2,0,0,1)
decelerate:cubic-bezier(0,0,0.2,1) | accelerate:cubic-bezier(0.4,0,1,1)

## SPRING PRESETS (Framer Motion)
snappy:{stiffness:500,damping:35} | base:{stiffness:400,damping:30}
gentle:{stiffness:200,damping:25} | bouncy:{stiffness:300,damping:15}

## Z-INDEX LAYERS
base(0)/raised(10)/dropdown(100)/sticky(200)/overlay(300)/modal(400)/toast(500)/tooltip(600)

## OPACITY
disabled(0.38) / muted(0.60) / full(1)

## DENSITY MODES
compact:    spaceMd 8px,  minHeight 32px, fontSize 13px
comfortable:spaceMd 16px, minHeight 40px, fontSize 15px
expanded:   spaceMd 24px, minHeight 48px, fontSize 17px

## DEPTH / GLASS
Glass for floating layers ONLY. Never on page content. Max blur: 16px.
subtle:  {background:rgba(255,255,255,0.08), backdropFilter:blur(8px),  border:1px solid rgba(255,255,255,0.12)}
moderate:{background:rgba(255,255,255,0.12), backdropFilter:blur(16px), border:1px solid rgba(255,255,255,0.16)}
Depth via surface layering — NOT box-shadow: layer0=page, 1=cards, 2=dropdowns, 3=sheets, 4=modals
