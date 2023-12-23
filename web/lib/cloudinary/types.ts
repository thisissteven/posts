export type ImageResponse = {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export type MediaAttributes = {
  public_id: string
  source: string
  highResSource: string
  width: number
  height: number
}

export type UploadFileProps = {
  formData: FormData | null
  onUploadProgress?: (progress: number) => void
}
