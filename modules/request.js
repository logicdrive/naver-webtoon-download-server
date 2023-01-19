import axios from "axios"

class Request
{
  /** GET 요청한 URL 주소에 대한 HTML 결과를 얻기 위해서 */
  static async get_For_Html(url)
  {
    return (await axios.get(url)).data
  }
}

export default Request