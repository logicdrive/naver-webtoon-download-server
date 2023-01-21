import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

async function router_callback(req, res)
{
  Params_Check.Para_is_null(req.query, ["type", "keyword"])
  Params_Check.Para_is_contatins(req.query, [["type", ["title", "image", "index"]]])
  
  const {type:SEARCH_TYPE, keyword:SEARCH_KEYWORD} = req.query
  switch(SEARCH_TYPE)
  {
    case "title" :
      const TITLE_INFOS = await Webtoon_Api.searched_Titles(SEARCH_KEYWORD)
      res.json({is_error:false, result:TITLE_INFOS})
      return

    case "index" :
      res.json({is_error:false, message:"[MOCK] 특정 웹툰에 대한 목차 목록을 반환시킴"})
      return
    
    case "image" :
      res.json({is_error:false, message:"[MOCK] 웹툰 이미지에 대한 zip 파일을 다운로드 시킴"})
      return
  }  
}

router_callback = Wrap.Wrap_With_Try_Res_Promise(router_callback)

const router = express.Router()
router.get('/', router_callback)

export default router