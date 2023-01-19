import express from "express"

const router = express.Router()


router.get('/', (req, res) => {
  const SEARCH_TYPES_TO_CHECK = ["title", "image", "index"]
  
  const {type:SEARCH_TYPE} = req.query
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

  switch(SEARCH_TYPE)
  {
    case "title" :
      res.json({is_error:false, message:"[MOCK] 웹툰명 검색 결과를 반환시킴"})
      return

    case "index" :
      res.json({is_error:false, message:"[MOCK] 특정 웹툰에 대한 목차 목록을 반환시킴"})
      return
    
    case "image" :
      res.json({is_error:false, message:"[MOCK] 웹툰 이미지에 대한 zip 파일을 다운로드 시킴"})
      return
  }
})


export default router