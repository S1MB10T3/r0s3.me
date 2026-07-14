/* oxlint-disable react/only-export-components -- content pages export frontmatter by design */
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import type { PageFrontmatter } from '../types'
import { Intro } from '../../overlay/template/Intro'
import { Postmortem } from '../../overlay/template/Postmortem'
import './espa.css'

/**
 * Bespoke TSX page (ADR-001 escape hatch). Unlike MDX pages, custom pages
 * export their metadata as a `frontmatter` const and import the template
 * components directly (MDX gets them injected via MDXProvider) — or break
 * from the template entirely where the art direction calls for it.
 *
 * Espa breaks from the template in the work section: the phone mock stays
 * pinned while scrolling scrubs through a sequence of demo screens, with
 * the feature caption swapping alongside (Figma 87:407, frame 89:423).
 */
export const frontmatter: PageFrontmatter = {
  title: 'Espa Labs',
  featured: true,
  priority: 100,
  // image header from Espa case study Hero (87:408); may return to a Rive
  // artboard when that asset lands
  header: { type: 'image', src: 'media/espa/header.webp' },
  tags: ['Product'],
  description:
    'About Espa helps teams move faster by streamlining collaboration and eliminating ' +
    'friction. Built for modern workflows, it adapts to how you work, not the other way around.',
  images: ['media/espa/screen-1.webp', 'media/espa/screen-2.webp', 'media/espa/screen-3.webp'],
}

interface Step {
  id: string
  title: string
  copy: string
  /** Demo photo shown inside the phone mock. Pulled from Home Espa work strip
      fills (103:105): inbox, permissions, task. Case-study frame 89:427 is still
      an empty placeholder in Figma. */
  screen: string
}

/* Figma only mocks the first caption; the rest are placeholder copy in the
   same register until the real feature walkthrough is written. */
const STEPS: Step[] = [
  {
    id: 'discussion',
    title: 'Feature/Discussion',
    copy:
      'This feature streamlines the workflow by consolidating key actions into a single, ' +
      'intuitive interface, reducing friction and enabling teams to move faster with ' +
      'greater confidence.',
    screen: 'media/espa/screen-1.webp',
  },
  {
    id: 'automation',
    title: 'Feature/Automation',
    copy:
      'Routine work runs itself. Espa watches for the moments that used to need a human ' +
      'in the loop and handles them end to end, surfacing only the decisions that ' +
      'actually deserve attention.',
    screen: 'media/espa/screen-2.webp',
  },
  {
    id: 'integration',
    title: 'Feature/Integration',
    copy:
      'Espa plugs into the tools teams already live in, so context follows the work. ' +
      'Conversations, documents, and tasks stay connected without anyone copying ' +
      'anything between apps.',
    screen: 'media/espa/screen-3.webp',
  },
]

export default function Espa() {
  return (
    <>
      <Intro>
        Espa Labs is an AI-first company building intelligent assistants that help teams
        work smarter. Powered by cutting-edge language models, Espa's platform enables
        seamless automation, natural conversation, and deep integration with the tools
        you already use.
      </Intro>
      <WorkSequence />
      <Postmortem>
        Onboarding was a success! New users are up and running quickly, with guided setup
        completing in under 5 minutes. Teams have praised the intuitive flow, and early
        retention metrics show strong engagement from day one.
      </Postmortem>
    </>
  )
}

/**
 * Dark work section, WORK_0n on the side rail like a template <Section>, but
 * the body is a scroll-scrubbed stage: the track is (steps + 1) viewports
 * tall, the stage inside it is sticky, and scroll progress through the track
 * crossfades screens inside the pinned phone mock.
 */
function WorkSequence() {
  const trackRef = useRef<HTMLDivElement>(null)
  // The overlay scrolls in .overlay__scroll, not the window, so Motion's
  // useScroll needs that element as its container. Resolved after mount;
  // until then (and if the page ever renders outside the overlay shell)
  // the first step shows statically.
  const [scroller, setScroller] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    setScroller(trackRef.current?.closest<HTMLElement>('.overlay__scroll') ?? null)
  }, [])

  return (
    <section className="page-section page-section--dark espa-work">
      <div className="page-section__railtrack">
        <span className="page-section__rail">work</span>
      </div>
      <div className="espa-track" ref={trackRef}>
        {scroller ? (
          <SequenceStage scroller={scroller} trackRef={trackRef} />
        ) : (
          <div className="espa-stage">
            <StepCaption step={STEPS[0]} />
            <div className="espa-phone">
              <StepScreen step={STEPS[0]} index={0} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SequenceStage({
  scroller,
  trackRef,
}: {
  scroller: HTMLElement
  trackRef: RefObject<HTMLDivElement | null>
}) {
  const containerRef = useRef(scroller)
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div className="espa-stage">
      {STEPS.map((step, i) => (
        <FadeStep key={step.id} index={i} progress={scrollYProgress}>
          <StepCaption step={step} />
        </FadeStep>
      ))}
      <div className="espa-phone">
        {STEPS.map((step, i) => (
          <FadeStep key={step.id} index={i} progress={scrollYProgress} zoom>
            <StepScreen step={step} index={i} />
          </FadeStep>
        ))}
      </div>
      <div className="espa-progress" aria-hidden="true">
        <motion.div className="espa-progress__bar" style={{ scaleX: scrollYProgress }} />
      </div>
    </div>
  )
}

/**
 * Crossfades its child in/out over this step's slice of the scroll progress.
 * Fades overlap the slice boundaries so adjacent steps blend instead of
 * dipping to black; the first step starts visible and the last stays visible.
 * Motion compiles these into native scroll-timeline keyframes, so every
 * input stop must stay inside [0, 1].
 */
function FadeStep({
  index,
  progress,
  zoom = false,
  children,
}: {
  index: number
  progress: MotionValue<number>
  /** Screens also settle from a slight zoom as they fade in. */
  zoom?: boolean
  children: ReactNode
}) {
  const n = STEPS.length
  const seg = 1 / n
  const fade = seg * 0.18
  const start = index * seg
  const end = start + seg
  const first = index === 0
  const last = index === n - 1

  // every stop list is anchored at 0 and 1: Motion compiles these into
  // native scroll-timeline keyframes, and sparse/out-of-range offsets
  // produce wrong (or throwing) animations
  const stops = [
    0,
    ...(first ? [] : [start - fade, start + fade]),
    ...(last ? [] : [end - fade, end + fade]),
    1,
  ]
  const values = [
    first ? 1 : 0,
    ...(first ? [] : [0, 1]),
    ...(last ? [] : [1, 0]),
    last ? 1 : 0,
  ]
  const opacity = useTransform(progress, stops, values)
  const scale = useTransform(
    progress,
    first ? [0, 1] : [0, start - fade, start + fade, 1],
    zoom && !first ? [1.06, 1.06, 1, 1] : first ? [1, 1] : [1, 1, 1, 1],
  )

  return (
    <motion.div className="espa-fade" style={{ opacity, scale }}>
      {children}
    </motion.div>
  )
}

function StepCaption({ step }: { step: Step }) {
  return (
    <div className="espa-caption">
      <h3 className="espa-caption__title">{step.title}</h3>
      <p className="espa-caption__copy">{step.copy}</p>
    </div>
  )
}

function StepScreen({ step, index }: { step: Step; index: number }) {
  return (
    <div className="espa-screen">
      <img src={step.screen} alt="" />
      {/* placeholder chrome: makes the sequencing visible while every demo
          photo is still black.png; drop when real captures land */}
      <span className="espa-screen__label">SCREEN_0{index + 1}</span>
    </div>
  )
}
