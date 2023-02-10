import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Service from "../../../modules/webtoon_service.js"

async function get_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.query, ["title_id", "start_index", "end_index"])
  const TITLE_ID = req.query.title_id
  const START_INDEX = Number(req.query.start_index)
  const END_INDEX = Number(req.query.end_index)

  const INDEX_INFOS = await Webtoon_Service.index_Infos_By_Range(TITLE_ID, START_INDEX, END_INDEX)
  res.json({is_error:false, index_infos:INDEX_INFOS})
}
get_Router_callback = Wrap.wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router