import express from "express"
import Wrap from "../../../modules/wrap.js"
import Params_Check from "../../../modules/params_check.js"
import Webtoon_Service from "../../../modules/webtoon_service.js"
import System from "../../../modules/system.js"

import UUID from "../../../modules/uuid.js"
import fs from "fs"

/** 유저가 요청한 특정 웹툰 화수들에 대한 다운로드 서비스를 제공하기 위해서 */
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
    const INDEX_DOWNLOAD_FOLDER_PATH = `${DOWNLOAD_FOLDER_PATH}/${WEBTOON_INFO.directory_name}`
    fs.mkdirSync(INDEX_DOWNLOAD_FOLDER_PATH)

    console.log(`[*] ${webtoon_info_index}/${WEBTOON_INFOS.length-1} 인덱스 화 다운로드 시도중...`)
    await Webtoon_Service.download_Webtoon_Images(WEBTOON_INFO.title_id, WEBTOON_INFO.index, INDEX_DOWNLOAD_FOLDER_PATH)
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
router.post('/', post_Router_callback)
export default router