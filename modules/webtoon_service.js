import fs from "fs"
import Webtoon_Api from "./webtoon_api.js"
import Request from "./request.js"

/** webtoon_api를 활용한 더 고수준의 행위들을 추상화시키기 위한 라이브러리 */
class Webtoon_Service
{
  /** 주어진 title_id, index에 매칭되는 웹툰 이미지들을 다운받아서 특정 폴더에 저장시킴 */
  static async download_Webtoon_Images(title_id, index, save_folder_path)
  {
    const IMAGE_LINKS = await Webtoon_Api.get_Image_Links(title_id, index)
    for(let link_index=0; link_index<IMAGE_LINKS.length; link_index++)
    {
      const IMAGE_DATA = await Request.get_For_Multimedia_Data(IMAGE_LINKS[link_index])
      if(IMAGE_DATA==null)
        throw new Error("이미지 데이터 받아오기에 실패함 !")
      
      const DOWNLOAD_IMAGE_PATH = `${save_folder_path}/image_${link_index+1}.jpg`
      fs.writeFileSync(DOWNLOAD_IMAGE_PATH, IMAGE_DATA)
      console.log(`[*] ${link_index}/${IMAGE_LINKS.length-1} 번째 인덱스 이미지 다운로드 완료!`)
    }
  }
}

export default Webtoon_Service