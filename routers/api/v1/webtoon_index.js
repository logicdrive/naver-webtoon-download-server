import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

/** 유저가 제공한 웹툰 타이틀 ID의 최대 화수를 반환시키기 위해서 */
async function get_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.query, ["title_id"])
  const {title_id:TITLE_ID} = req.query

  const MAX_INDEX = await Webtoon_Api.max_Index(TITLE_ID)
  res.json({is_error:false, result:MAX_INDEX})
}
get_Router_callback = Wrap.wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router