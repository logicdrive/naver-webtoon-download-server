import cheerio from "cheerio"
import url from "url"
import Request from "./request.js"

/** 네이버 웹툰 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Webtoon_Api
{
  /** 네이버 웹툰에서 검색한 내용들 중에서 [타이틀, 타이틀 ID] 부분만 추출해서 반환시키기 위해서 */
  static async searched_Titles(keyword)
  {
    const HTML_RES = await Request.get_For_Html(`https://comic.naver.com/search?keyword=${keyword}`)
    const $ = cheerio.load(HTML_RES)
    const TITLE_INFOS = $("div#content div.resultBox:nth-child(2) ul.resultList h5 a")
              .toArray()
              .map((e) => {
                const TITLE = $(e).text()
                const TITLE_ID = url.parse($(e).attr("href"), true).query.titleId
                return {title:TITLE, title_id:TITLE_ID} 
              })
    return TITLE_INFOS
  }

  /** 주어진 타이틀 ID과 매칭되는 웹툰의 최대 화수(no)를 추출해서 반환시키기 위해서 */
  static async max_Index(title_id)
  {
    const HTML_RES = await Request.get_For_Html(`https://comic.naver.com/webtoon/list?titleId=${title_id}`)
    const $ = cheerio.load(HTML_RES)
    const INDEX_INFOS = $("div#content table.viewList tr td.title a").toArray()
    const MAX_INDEX = url.parse($(INDEX_INFOS[0]).attr("href"), true).query.no
    return MAX_INDEX
  }
}

export default Webtoon_Api