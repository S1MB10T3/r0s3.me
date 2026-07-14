/* oxlint-disable react/only-export-components -- content pages export frontmatter by design */
import type { PageFrontmatter } from '../types'
import { Intro } from '../../overlay/template/Intro'
import { Section } from '../../overlay/template/Section'
import { Postmortem } from '../../overlay/template/Postmortem'

/**
 * Bespoke TSX page (ADR-001 escape hatch). Unlike MDX pages, custom pages
 * export their metadata as a `frontmatter` const and import the template
 * components directly (MDX gets them injected via MDXProvider) — or break
 * from the template entirely where the art direction calls for it.
 * Placeholder until the real Espa study is ported from Figma node 87:407.
 */
export const frontmatter: PageFrontmatter = {
  title: 'Espa Labs',
  featured: true,
  priority: 100,
  header: { type: 'rive', src: 'rive/espa-header.riv' },
  tags: ['Product'],
  description:
    'About Espa helps teams move faster by streamlining collaboration and eliminating ' +
    'friction. Built for modern workflows, it adapts to how you work, not the other way around.',
}

export default function Espa() {
  return (
    <>
      <Intro>Espa Labs intro copy goes here.</Intro>
      <Section title="work">Espa Labs work section placeholder.</Section>
      <Postmortem>Espa Labs postmortem placeholder.</Postmortem>
    </>
  )
}
