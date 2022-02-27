const urlHead = 'https://res.cloudinary.com/basd4g/image/upload/co_rgb:505050,l_text:Sawarabi%20Gothic_64_align_center:'
const urlTail = ',w_800,c_fit/v1620733120/memo-yammer-jp.png'

const OgImageUrlInText = (text: string) => {
  return `${urlHead}${encodeURIComponent(text)}${urlTail}`
}
export { OgImageUrlInText }
