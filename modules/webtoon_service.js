import fs from "fs"
import Webtoon_Api from "./webtoon_api.js"
import Request from "./request.js"
import Promise_Lib from "./promise.js"
import Dictionary_Array from "./dictionary_array.js"
import Iter from "./iter.js"

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

  /** 주어진 타이틀의 특정 범위에 속하는 인덱스 정보들을 정렬된 순서대로 반환시키기 위해서 */
  static async index_Infos_By_Range(title_id, start_index, end_index, parallel_degree=5)
  {
    let index_infos = []
    await Promise_Lib.parallel_Processing(Iter.range(start_index, end_index+1), parallel_degree, (resolve, index) => {
      Webtoon_Api.get_Index_Name(title_id, index).then((index_name) => {
        index_infos.push({index:index, name:`${index} : ${index_name}`})
        resolve()
      })
    })    
    return Dictionary_Array.sort_By_Key(index_infos, "index")
  }
}

export default Webtoon_Service