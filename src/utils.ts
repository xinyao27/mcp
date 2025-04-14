export async function convertUrlToBase64({ mimeType, url }: { mimeType?: string; url: string }) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  const _mimeType = mimeType ?? response.headers.get('content-type') ?? 'image/jpeg'
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const data = `data:${_mimeType};base64,${base64}`

  return { base64, data, mimeType: _mimeType }
}
