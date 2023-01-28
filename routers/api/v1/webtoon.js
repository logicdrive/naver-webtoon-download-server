import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"
import System from "../../../modules/system.js"

import Element from "../../../modules/element.js"
import axios from "axios"

import UUID from "../../../modules/uuid.js"
import fs from "fs"

/** 유저가 요청한 키워드들에 대한 검색 결과를 제공해주기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.query, ["type"])
  Params_Check.para_is_contains(req.query, [["type", ["title", "index"]]])
  const {type:SEARCH_TYPE} = req.query
  
  switch(SEARCH_TYPE)
  {
    case "title" :
      Params_Check.para_is_null_or_empty(req.query, ["keyword"])
      const {keyword:KEYWORD} = req.query
      
      const TITLE_INFOS = await Webtoon_Api.searched_Titles(KEYWORD)
      res.json({is_error:false, result:TITLE_INFOS})
      return

    case "index" :
      Params_Check.para_is_null_or_empty(req.query, ["title_id"])
      const {title_id:TITLE_ID} = req.query
      
      const MAX_INDEX = await Webtoon_Api.max_Index(TITLE_ID)
      res.json({is_error:false, result:MAX_INDEX})
      return
  }  
}
get_Router_callback = Wrap.wrap_With_Try_Res_Promise(get_Router_callback)

/** 유저가 요청한 특정 웹툰 화수에 대한 다운로드 서비스를 제공하기 위해서 */
async function post_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.body, ["webtoon_infos"])
  const {webtoon_infos:WEBTOON_INFOS} = req.body

  const FOLDER_UUID = UUID.get_UUID()
  const DOWNLOAD_FOLDER_PATH = `./downloads/${FOLDER_UUID}`
  fs.mkdirSync(DOWNLOAD_FOLDER_PATH)
  
  for(let webtoon_info_index=0; webtoon_info_index<WEBTOON_INFOS.length;  webtoon_info_index++)
  {
    const WEBTOON_INFO = WEBTOON_INFOS[webtoon_info_index]
    const INDEX_DOWNLOAD_FOLDER_PATH = `${DOWNLOAD_FOLDER_PATH}/${WEBTOON_INFO.index}화`
    fs.mkdirSync(INDEX_DOWNLOAD_FOLDER_PATH)
    
    const [IMAGE_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/webtoon/detail?titleId=${WEBTOON_INFO.title_id}&no=${WEBTOON_INFO.index}`, `div#comic_view_area div.wt_viewer img[id^="content"]`)
    const IMAGE_LINKS = IMAGE_SELS.map((e) => $(e).attr("src"))

    for(let link_index=0; link_index<IMAGE_LINKS.length; link_index++)
    {
      const IMAGE_DATA = (await axios.get(IMAGE_LINKS[link_index], {
                        responseType: 'arraybuffer',
                         headers: {
                           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                         }
                        })).data
      if(IMAGE_DATA==null)
        throw new Error("이미지 데이터 받아오기에 실패함 !")
      
      const DOWNLOAD_IMAGE_PATH = `${INDEX_DOWNLOAD_FOLDER_PATH}/image_${link_index+1}.jpg`
      fs.writeFileSync(DOWNLOAD_IMAGE_PATH, IMAGE_DATA)
      
      console.log(`[*] ${webtoon_info_index}/${WEBTOON_INFOS.length-1} 인덱스 화 ${link_index}/${IMAGE_LINKS.length-1} 번째 인덱스 이미지 다운로드 완료!`)
    }
    
    if(webtoon_info_index != WEBTOON_INFOS.length-1) { await System.sleep(1000) }
  }
  const ZIP_PATH = `./downloads/${FOLDER_UUID}.zip`
  await System.execute_Shell_Command(`cd ${DOWNLOAD_FOLDER_PATH};zip -r ../${FOLDER_UUID}.zip ./*`)

  const ZIP_DATA_BASE64 = fs.readFileSync(ZIP_PATH, {encoding: 'base64'})
  const ZIP_DATA_URL = "data:file/zip;base64," + ZIP_DATA_BASE64

  fs.rmSync(DOWNLOAD_FOLDER_PATH, {recursive: true, force: true})
  fs.rmSync(ZIP_PATH, {force: true})
  res.json({is_error:false, data_url:ZIP_DATA_URL})
}
post_Router_callback = Wrap.wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
router.post('/', post_Router_callback)
export default router