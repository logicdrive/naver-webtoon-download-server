import fs from "fs"
import Webtoon_Api from "./webtoon_api.js"
import Request from "./request.js"
import Promise_Lib from "./promise.js"

/** webtoon_api를 활용한 더 고수준의 행위들을 추상화시키기 위한 라이브러리 */
class Webtoon_Service
{
  /** 주어진 title_id, index에 매칭되는 웹툰 이미지들을 다운받아서 특정 폴더에 저장시킴 */
  static async download_Webtoon_Images(title_id, index, save_folder_path, parallel_degree=10)
  {
    const IMAGE_LINKS = await Webtoon_Api.get_Image_Links(title_id, index)

    await Promise_Lib.parallel_Processing(IMAGE_LINKS, parallel_degree, (resolve, image_link, image_index) => {
      Request.get_For_Multimedia_Data(image_link).then((image_data) => {
        const DOWNLOAD_IMAGE_PATH = `${save_folder_path}/image_${image_index+1}.jpg`
        fs.writeFile(DOWNLOAD_IMAGE_PATH, image_data, () => {
          console.log(`[*] ${image_index}/${IMAGE_LINKS.length-1} 번째 인덱스 이미지 다운로드 완료!`)
          resolve()
        })
      })
    })
  }
}

export default Webtoon_Service