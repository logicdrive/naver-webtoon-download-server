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

  /** 주어진 웹툰 타이틀 ID의 인덱스와 매칭되는 목차명을 반환시키기 위해서 */
  static async get_Index_Name(title_id, index)
  {
    const [TITLE_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/webtoon/detail?titleId=${title_id}&no=${index}`, "div.tit_area div.view h3")
    return $(TITLE_SELS[0]).text()
  }
  
  /** 주어진 타이틀 ID - 인덱스와 매칭되는 웹툰의 이미지 링크 리스트를 반환시키기 위해서 */
  static async get_Image_Links(title_id, index)
  {
    const [IMAGE_SELS, $] = await Element.external_Css_Sels(`https://comic.naver.com/webtoon/detail?titleId=${title_id}&no=${index}`, `div#comic_view_area div.wt_viewer img[id^="content"]`)
    const IMAGE_LINKS = IMAGE_SELS.map((e) => $(e).attr("src"))
    return IMAGE_LINKS
  }
}

export default Webtoon_Api