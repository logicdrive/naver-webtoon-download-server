import axios from "axios"
import cheerio from "cheerio"
import url from "url"

// 네이버 웹툰에서 키워드로 검색결과 얻는 예제 코드
const REQ_RES = await axios.get("https://comic.naver.com/search?keyword=애옹")

console.log(REQ_RES.status) // 응답 상태 코드 얻기
console.log(REQ_RES.data) // 응답 HTML 코드 얻기

// 응답 HTML에서 검색된 웹툰 제목(title)과 관련된 타이틀 ID(title_id) 얻기
const $ = cheerio.load(REQ_RES.data)
const TITLE_INFOS = $("div#content div.resultBox:nth-child(2) ul.resultList h5 a")
              .toArray()
              .map((e) => {
                const TITLE = $(e).text()
                const TITLE_ID = url.parse($(e).attr("href"), true).query.titleId
                return {title:TITLE, title_id:TITLE_ID} 
              })
console.log(TITLE_INFOS)