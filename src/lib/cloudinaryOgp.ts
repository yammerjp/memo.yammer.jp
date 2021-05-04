const urlHead = "https://res.cloudinary.com/basd4g/image/upload/co_rgb:505050,l_text:Sawarabi%20Gothic_64_align_center:";
const urlTail = ",w_800,c_fit/v1608780036/memo-basd4g-net-ogp.png";
 
const OgImageUrlInText = (text: string) => {
    return `${urlHead}${encodeURIComponent(text)}${urlTail}`
}
export {OgImageUrlInText}