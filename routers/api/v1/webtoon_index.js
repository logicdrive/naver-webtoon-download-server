import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Api from "../../../modules/webtoon_api.js"

async function get_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.query, ["title_id", "start_index", "end_index"])
  const TITLE_ID = req.query.title_id
  const START_INDEX = Number(req.query.start_index)
  const END_INDEX = Number(req.query.end_index)

  let index_infos = []
  for(let index=START_INDEX; index<=END_INDEX; index++)
  {
    const INDEX_NAME = await Webtoon_Api.get_Index_Name(TITLE_ID, index)
    index_infos.push({index:index, name:`${index} : ${INDEX_NAME}`})
  }
  
  res.json({is_error:false, index_infos:index_infos})
}
get_Router_callback = Wrap.wrap_With_Try_Res_Promise(get_Router_callback)

const router = express.Router()
router.get('/', get_Router_callback)
export default router