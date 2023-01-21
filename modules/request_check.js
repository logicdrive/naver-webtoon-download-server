class Request_Check
{
  /** 주어진 URL query 에서 특정 para가 NULL인 경우 예외를 일으키기 위해서
  * 
  * Query_para_is_null(req, [["type", "요청타입"], ["keyword", "검색어"]])
  *
  * // req.query 에서 type이 null인 경우, `'요청타입'관련 파라미터가 전달되지 않았습니다 !`라는 예외를 발생시킴
  */
  static Query_para_is_null(req, para_infos_to_check)
  {
    for(let para_info of para_infos_to_check)
      if(req.query[para_info[0]] == null)
        throw new Error(`'${para_info[1]}'관련 파라미터가 전달되지 않았습니다 !`)
  }
}

export default Request_Check