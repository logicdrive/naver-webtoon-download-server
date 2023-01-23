import cheerio from "cheerio"
import Request from "./request.js"

/** HTML 요소 관련 처리를 위한 라이브러리 */
class Element
{
  /** 외부 URL 요청으로 HTML을 추출하고, CSS 선택자로 검색된 요소들을 반환시킴 */
  static async external_Css_Sels(url, css_selector)
  {
    const HTML_RES = await Request.get_For_Html(url)
    const $ = cheerio.load(HTML_RES)
    const CSS_SELS = $(css_selector).toArray()
    return [CSS_SELS, $]
  }    
}

export default Element