import express from "express"
import cheerio from "cheerio"
import url from "url"
import Request from "../../../modules/request.js"
import Wrap from "../../../modules/wrap.js"
import Request_Check from "../../../modules/request_check.js"

async function router_callback(req, res)
{
  Request_Check.Query_para_is_null(req, [["type", "검색 타입"], ["keyword", "검색어"]])
  Request_Check.Query_para_is_contatins(req, [["type", "검색 타입", ["title", "image", "index"]]])
  const {type:SEARCH_TYPE, keyword:SEARCH_KEYWORD} = req.query
   
  switch(SEARCH_TYPE)
  {
    case "title" :
      const HTML_RES = await Request.get_For_Html(`https://comic.naver.com/search?keyword=${SEARCH_KEYWORD}`)
      const $ = cheerio.load(HTML_RES)
      const TITLE_INFOS = $("div#content div.resultBox:nth-child(2) ul.resultList h5 a")
            .toArray()
            .map((e) => {
              const TITLE = $(e).text()
              const TITLE_ID = url.parse($(e).attr("href"), true).query.titleId
              return {title:TITLE, title_id:TITLE_ID} 
            })
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