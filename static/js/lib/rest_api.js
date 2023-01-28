/** 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Rest_Api
{
  /** 서버에 웹툰명을 검색한 결과를 반환시키기 위해서 */
  static async search_Webtoon_Titles(keyword)
  {
    const REQ_RESULT = await Rest_Api.request_With_Error_Check(`/api/v1/webtoon?type=title&keyword=${keyword}`, "GET")
    return REQ_RESULT.result
  }

  /** 특정 웹툰에 대한 최대 목차를 반환시키기 위해서 */
  static async search_Max_Index(title_id)
  {
    const REQ_RESULT = await Rest_Api.request_With_Error_Check(`/api/v1/webtoon?type=index&title_id=${title_id}`, "GET")
    return Number(REQ_RESULT.result)
  }

  /** 전달된 웹툰 정보들을 바탕으로 .zip로 크롤링된 DATA URL을 얻기 위해서 */
  static async data_Url_From_Webtoons_Zip(webtoon_infos)
  {
    const REQ_RESULT = await Rest_Api.request_With_Error_Check("/api/v1/webtoon", "POST", {"webtoon_infos":webtoon_infos})
    return REQ_RESULT.data_url
  }

  /** 서버 응답을 받기전에 에러여부를 확인해서 예외를 일으키기 위해서 */
  static async request_With_Error_Check(url, request_type, json_body={})
  {
    const REQ_RESULT = await Request.JSON_Request(url, request_type, json_body)
    if(REQ_RESULT.is_error)
      throw new Error(`Sorry, Some error was happened...\nError Message : ${REQ_RESULT.message}`)
    return REQ_RESULT
  }
}