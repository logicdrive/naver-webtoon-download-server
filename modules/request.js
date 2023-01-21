import axios from "axios"

/** 서버에서의 HTTP 요청이 일관성있게 이루어지게 하기 위한 라이브러리 */
class Request
{
  /** GET 요청한 URL 주소에 대한 HTML 결과를 얻기 위해서 */
  static async get_For_Html(url)
  {
    return (await axios.get(url)).data
  }
}

export default Request