import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

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
  console.log(WEBTOON_INFOS)

  res.json({is_error:false, message:"[MOCK] 웹툰 이미지에 대한 zip 파일을 다운로드 시킴"})
}

get_Router_callback = Wrap.Wrap_With_Try_Res_Promise(get_Router_callback)
post_Router_callback = Wrap.Wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
router.post('/', post_Router_callback)

export default router