import express from "express"
import cheerio from "cheerio"
import url from "url"
import Request from "../../../modules/request.js"

const router = express.Router()


router.get('/', async (req, res) => {
  const SEARCH_TYPES_TO_CHECK = ["title", "image", "index"]
  
  const {type:SEARCH_TYPE, keyword:SEARCH_KEYWORD} = req.query
  if(SEARCH_TYPE == null)
  {
    res.json({is_error:true, message:"요청하는 검색 타입이 지정되지 않았습니다!"})
    return
  }
  if(!SEARCH_TYPES_TO_CHECK.includes(SEARCH_TYPE))
  {
    res.json({is_error:true, message:"검색타입이 유효하지 않습니다!"})
    return
  }

  try {
    
    switch(SEARCH_TYPE)
    {
      case "title" :
        if(SEARCH_KEYWORD == null)
        {
          res.json({is_error:true, message:"검색할 키워드가 지정되지 않았습니다!"})
          return
        }

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
  catch(e)
  {
    console.log(e)
    res.json({is_error:true, message:"서버에서 처리 도중 에러가 발생함!"})
    return
  }
})


export default router