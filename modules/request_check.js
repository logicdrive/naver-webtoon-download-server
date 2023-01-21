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

  /** 주어진 URL query 에서 특정 para가 특정 리스트들 중에 한 요소를 포함하고 있지 않은 경우 예외를 일으키기 위해서
  *
  * Query_para_is_contatins(req, [["type", "요청타입", ["title", "image", "index"]]])
  *
  * // req.query 에서 type이 ["title", "image", "index"] 중에서 아무것도 속하지 않은 경우 `'요청타입'관련 파라미터가 적합하지 않은 요소를 가지고 있습니다!`라는 예외를 발생시킴
  */
  static Query_para_is_contatins(req, para_infos_to_check)
  {
    for(let para_info of para_infos_to_check)
      if(!para_info[2].includes(req.query[para_info[0]]))
        throw new Error(`''${para_info[1]}'관련 파라미터가 적합하지 않은 요소를 가지고 있습니다!`)
  }
}

export default Request_Check