import axios from "axios"

/** 서버에서의 HTTP 요청이 일관성있게 이루어지게 하기 위한 라이브러리 */
class Request
{
  /** GET 요청한 URL 주소에 대한 HTML 결과를 얻기 위해서 */
  static async get_For_Html(url)
  {
    return (await axios.get(url)).data
  }

  /** 주어진 링크에 있는 이미지, 동영상과 같은 멀티미디어 데이터들을 바이너리 형태로 얻기 위해서 */
  static async get_For_Multimedia_Data(url)
  {
    return (await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"}
    })).data
  }
}

export default Request