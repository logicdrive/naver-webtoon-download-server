import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Service from "../../../modules/webtoon_service.js"

/** 유저가 요청한 특정 웹툰 화수들에 대한 다운로드 서비스를 제공하기 위해서 */
async function post_Router_callback(req, res)
{
  Params_Check.para_is_null_or_empty(req.body, ["webtoon_infos"])
  const {webtoon_infos:WEBTOON_INFOS} = req.body

  const ZIP_DATA_URL = await Webtoon_Service.webtoon_Images_Zip_Data_Url(WEBTOON_INFOS)
  res.json({is_error:false, data_url:ZIP_DATA_URL})
}
post_Router_callback = Wrap.wrap_With_Try_Res_Promise(post_Router_callback)

const router = express.Router()
router.post('/', post_Router_callback)
export default router