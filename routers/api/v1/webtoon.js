import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

/** 유저가 요청한 키워드들에 대한 검색 결과를 제공해주기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.Para_is_null_or_empty(req.query, ["type", "keyword"])
  Params_Check.Para_is_contains(req.query, [["type", ["title", "image", "index"]]])
  
  const {type:SEARCH_TYPE, keyword:SEARCH_KEYWORD} = req.query
  switch(SEARCH_TYPE)
  {
    case "title" :
      const TITLE_INFOS = await Webtoon_Api.searched_Titles(SEARCH_KEYWORD)
      res.json({is_error:false, result:TITLE_INFOS})
      return

    case "index" :
      const MAX_INDEX = await Webtoon_Api.max_Index(SEARCH_KEYWORD)
      res.json({is_error:false, result:MAX_INDEX})
      return
    
    case "image" :
      res.json({is_error:false, message:"[MOCK] 웹툰 이미지에 대한 zip 파일을 다운로드 시킴"})
      return
  }  
}

get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)

export default router