export interface Mix {
  id: string
  title: string
  /** Full SoundCloud track/playlist URL. */
  url: string
}

/** DJ mixes shown in the media player dropdown (usually ~3). Replace with real links. */
export const mixes: Mix[] = [
  { id: 'mix-01', title: 'MIX_01 // placeholder', url: 'https://soundcloud.com/CHANGE-ME/mix-01' },
  { id: 'mix-02', title: 'MIX_02 // placeholder', url: 'https://soundcloud.com/CHANGE-ME/mix-02' },
  { id: 'mix-03', title: 'MIX_03 // placeholder', url: 'https://soundcloud.com/CHANGE-ME/mix-03' },
]
