import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

import Element from "../../../modules/element.js"
import axios from "axios"

/** 유저가 요청한 키워드들에 대한 검색 결과를 제공해주기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["type"])
  Params_Check.Para_is_contains(req.query, [["type", ["title", "index"]]])
  const {type:SEARCH_TYPE} = req.query
  
  switch(SEARCH_TYPE)
  {
    case "title" :
      Params_Check.Para_is_null_or_empty(req.query, ["keyword"])
      const {keyword:KEYWORD} = req.query
      
      const TITLE_INFOS = await Webtoon_Api.searched_Titles(KEYWORD)
      res.json({is_error:false, result:TITLE_INFOS})
      return

    case "index" :
      Params_Check.Para_is_null_or_empty(req.query, ["title_id"])
      const {title_id:TITLE_ID} = req.query
      
      const MAX_INDEX = await Webtoon_Api.max_Index(TITLE_ID)
      res.json({is_error:false, result:MAX_INDEX})
      return
  }  
}

/** 유저가 요청한 특정 웹툰 화수에 대한 다운로드 서비스를 제공하기 위해서 */
async function post_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.body, ["webtoon_infos"])
  const {webtoon_infos:WEBTOON_INFOS} = req.body

  let IMAGE_DATA = null
  for(let webtoon_info of WEBTOON_INFOS)
  {
    const [IMAGE_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/webtoon/detail?titleId=${webtoon_info.title_id}&no=${webtoon_info.index}`, `div#comic_view_area div.wt_viewer img[id^="content"]`)
    const IMAGE_LINKS = IMAGE_SELS.map((e) => $(e).attr("src"))
    
    IMAGE_DATA = (await axios.get(IMAGE_LINKS[0], {
                      responseType: 'arraybuffer',
                       headers: {
                         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
                       }
                      })).data   
  }
  if(IMAGE_DATA==null)
    throw new Error("이미지 데이터 받아오기에 실패함 !")

  const IMAGE_DATA_BASE64 = Buffer.from(IMAGE_DATA, "binary").toString('base64')
  const IMAGE_DATA_URL = "data:image/jpg;base64," + IMAGE_DATA_BASE64
  res.json({is_error:false, data_url:IMAGE_DATA_URL})
}

get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)
post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
router.post('/', post_Router_callback)

export default router