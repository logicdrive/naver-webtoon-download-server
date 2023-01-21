/** 서버와의 일관성있는 통신 인터페이스를 제공하기 위한 라이브러리 */
class Rest_Api
{
  /** 서버에 웹툰명을 검색한 결과를 반환시키기 위해서 */
  static async Search_Webtoon_Titles(keyword)
  {
    const REQ_RESULT = await Request.JSON_Request(`/api/v1/webtoon?type=title&keyword=${keyword}`, "GET")
    if(REQ_RESULT.is_error)
      throw new Error(`에러가 발생했습니다. 에러 메세지 : ${REQ_RESULT.error_message}`)
    return REQ_RESULT.result
  }
}