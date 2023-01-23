function main()
{
    document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
}

/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
    e.preventDefault()
    
    const TITLE_TO_SEARCH = document.querySelector("#title_search_form input[type='text']").value
    if(TITLE_TO_SEARCH.length == 0) throw new Error("검색할 웹툰명을 입력해주세요!")

    const TITLE_RESULTS = await Rest_Api.Search_Webtoon_Titles(TITLE_TO_SEARCH)
    if(TITLE_RESULTS.length == 0) throw new Error("검색결과가 존재하지 않습니다! 검색할 웹툰명이 정확한지 확인해주세요!")

    Update_Title_Results_UI(TITLE_RESULTS)
    Element.add_On_Click_Trigger("#title_result_table td div", on_Click_Searched_Webtoon_Title)
}

/** 웹툰 제목 검색 결과를 UI에 업데이트시키기 위해서 */
function Update_Title_Results_UI(title_results)
{
  const TITLE_RESULT_HTMLS = title_results.map((title_result) => 
    `<tr><td><div title_id="${title_result.title_id}">${title_result.title}</div></td></tr>`)
  document.querySelector("#title_result_table").innerHTML = TITLE_RESULT_HTMLS.join('\n')
}

/** 검색된 웹툰 제목을 클릭할 경우, 그 웹툰에 관련된 목차를 출력하기 위해서 */
async function on_Click_Searched_Webtoon_Title(e)
{
  const TITLE_ID_KEYWORD = e.path[0].getAttribute("title_id")
  const MAX_INDEX = await Rest_Api.Search_Max_Index(TITLE_ID_KEYWORD)

  const range = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  const INDEX_RESULT_HTMLS = range(1, MAX_INDEX+1).map((index) => 
    `<tr><td><div title_id="${TITLE_ID_KEYWORD}" index="${index}">${index}화</div></td></tr>`)
  document.querySelector("#index_result_table").innerHTML = INDEX_RESULT_HTMLS.join('\n')
}

on_Submit_title_Search_Form = Wrap.Wrap_With_Try_Alert_Promise(on_Submit_title_Search_Form)
on_Click_Searched_Webtoon_Title = Wrap.Wrap_With_Try_Alert_Promise(on_Click_Searched_Webtoon_Title)
       
main()