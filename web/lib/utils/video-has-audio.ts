// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasAudio(video: any) {
  return (
    video.mozHasAudio ||
    Boolean(video.webkitAudioDecodedByteCount) ||
    Boolean(video.audioTracks?.length)
  )
}

export async function hasVideoGotAudio(src: string): Promise<boolean> {
  const video = document.createElement('video')
  video.muted = true
  video.crossOrigin = 'anonymous'
  video.preload = 'auto'

  return new Promise((resolve, reject) => {
    video.addEventListener('error', reject)

    video.addEventListener(
      'canplay',
      () => {
        video.currentTime = 0.99
      },
      { once: true } // Important because 'canplay' can be fired hundreds of times.
    )

    video.addEventListener('seeked', () => resolve(hasAudio(video)), {
      once: true,
    })

    video.src = src
  })
}
