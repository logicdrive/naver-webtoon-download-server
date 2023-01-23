import url from "url"
import Element from "./element.js"

/** 네이버 웹툰 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Webtoon_Api
{
  /** 네이버 웹툰에서 검색한 내용들 중에서 [타이틀, 타이틀 ID] 부분만 추출해서 반환시키기 위해서 */
  static async searched_Titles(keyword)
  {
    const [TITLE_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/search?keyword=${keyword}`, "div#content div.resultBox:nth-child(2) ul.resultList h5 a")
    const TITLE_INFOS = TITLE_SELS.map((e) => {
                            const TITLE = $(e).text()
                            const TITLE_ID = url.parse($(e).attr("href"), true).query.titleId
                            return {title:TITLE, title_id:TITLE_ID} 
                          })
    return TITLE_INFOS
  }

  /** 주어진 타이틀 ID과 매칭되는 웹툰의 최대 화수(no)를 추출해서 반환시키기 위해서 */
  static async max_Index(title_id)
  {
    const [INDEX_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/webtoon/list?titleId=${title_id}`, "div#content table.viewList tr td.title a")
    const MAX_INDEX = url.parse($(INDEX_SELS[0]).attr("href"), true).query.no
    return MAX_INDEX
  }
}

export default Webtoon_Api