import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

/** 주어진 키워드로 검색된 웹툰 타이틀 및 타이틀 ID들을 반환시키기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.query, ["keyword"])
  const {keyword:KEYWORD} = req.query

  const TITLE_INFOS = await Webtoon_Api.searched_Titles(KEYWORD)
  res.json({is_error:false, result:TITLE_INFOS})
}
get_Router_callback = Wrap.wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router