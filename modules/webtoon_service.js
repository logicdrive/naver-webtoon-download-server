import fs from "fs"
import Webtoon_Api from "./webtoon_api.js"
import Request from "./request.js"
import Array_Lib from "./array.js"

/** webtoon_api를 활용한 더 고수준의 행위들을 추상화시키기 위한 라이브러리 */
class Webtoon_Service
{
  /** 주어진 title_id, index에 매칭되는 웹툰 이미지들을 다운받아서 특정 폴더에 저장시킴 */
  static async download_Webtoon_Images(title_id, index, save_folder_path, parallel_degree=10)
  {
    const IMAGE_LINKS = await Webtoon_Api.get_Image_Links(title_id, index)
    
    const LINK_ENTRY_SPLITS = Array_Lib.range_Split(Object.entries(IMAGE_LINKS), parallel_degree)
    for(let link_entry_split of LINK_ENTRY_SPLITS)
    {
      const REQUEST_PROMISES = link_entry_split.map((link_entry) => {
        return new Promise((resolve) => {
          const [IMAGE_LINK, IMAGE_INDEX] = [link_entry[1], Number(link_entry[0])]
          
          Request.get_For_Multimedia_Data(IMAGE_LINK).then((image_data) => {
            const DOWNLOAD_IMAGE_PATH = `${save_folder_path}/image_${IMAGE_INDEX+1}.jpg`
            fs.writeFile(DOWNLOAD_IMAGE_PATH, image_data, () => {
              console.log(`[*] ${IMAGE_INDEX}/${IMAGE_LINKS.length-1} 번째 인덱스 이미지 다운로드 완료!`)
              resolve()
            })
          })
        })
      })
      await Promise.all(REQUEST_PROMISES)
    }
  }
}

export default Webtoon_Service