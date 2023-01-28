// 일관된 브라우저 동작을 지원하기 위한 라이브러리
class Browser
{
  /** 지정된 DATA URL을 이용해서 파일을 다운받도록 만들기 위해서 */
  static download_File(data_url, file_name)
  {
    const A_ELEMENT = document.createElement('a')
    A_ELEMENT.href = data_url
    A_ELEMENT.download = file_name

    document.body.appendChild(A_ELEMENT)
    A_ELEMENT.click()
    document.body.removeChild(A_ELEMENT)
  }
}