/** 클라이언트 측에서의 날짜 관련 연산 및 조작을 위한 라이브러리 */
class Date_Lib
{
  /** 주어진 Date 클래스를 일정한 날짜 포맷의 문자열 형식으로 변환시키기 위해서 
  *
  * Date_Lib.date_To_String(Date_Lib.date_Now(), "yyyy-MM-dd hh:mm:ss")
  * // "2023-02-02 15:43:44" 와 같은 형식의 문자열로 반환됨
  */
  static date_To_String(date, date_format)
  {
    date_format = date_format.replaceAll("yyyy", String(date.getFullYear()))
    
    date_format = date_format.replaceAll("MM", String(date.getMonth()+1).padStart(2, "0"))
    date_format = date_format.replaceAll("M", String(date.getMonth()+1))
    
    date_format = date_format.replaceAll("dd", String(date.getDate()).padStart(2, "0"))
    date_format = date_format.replaceAll("d", String(date.getDate()))

    date_format = date_format.replaceAll("hh", String(date.getHours()).padStart(2, "0"))
    date_format = date_format.replaceAll("h", String(date.getHours()))

    date_format = date_format.replaceAll("mm", String(date.getMinutes()).padStart(2, "0"))
    date_format = date_format.replaceAll("m", String(date.getMinutes()))

    date_format = date_format.replaceAll("ss", String(date.getSeconds()).padStart(2, "0"))
    date_format = date_format.replaceAll("s", String(date.getSeconds()))

    return date_format
  }

  // 현재 날짜 객체를 얻기 위해서
  static date_Now()
  {
    return new Date()
  }
}