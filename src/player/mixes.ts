export interface Mix {
  id: string
  title: string
  /** Full SoundCloud track/playlist URL. */
  url: string
}

/** DJ mixes shown in the media player dropdown (usually ~3). Replace with real links. */
export const mixes: Mix[] = [
  { id: 'jungle-shit', title: 'JUST_SOME_JUNGLE_SH!T', url: 'https://soundcloud.com/r0s3_me/just-some-jungle-sh-t' },
  { id: 'mix-02', title: 'MIX_02 // placeholder', url: 'https://soundcloud.com/CHANGE-ME/mix-02' },
  { id: 'mix-03', title: 'MIX_03 // placeholder', url: 'https://soundcloud.com/CHANGE-ME/mix-03' },
]
