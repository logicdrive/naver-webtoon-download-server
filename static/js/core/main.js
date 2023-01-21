function main()
{
    document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
}

/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
    e.preventDefault()
    
    const SEARCH_TITLE = document.querySelector("#title_search_form input[type='text']").value
    if(SEARCH_TITLE.length == 0)
    {
      alert("검색할 웹툰명을 입력해주세요!")
      return
    }

    const SEARCH_RESULTS = await Rest_Api.Search_Webtoon_Titles(SEARCH_TITLE)
    if(SEARCH_RESULTS.length == 0)
    {
      alert("검색결과가 존재하지 않습니다! 검색할 웹툰명이 정확한지 확인해주세요!")
      return
    }

    const TITLE_RESULT_TABLE_SEL = document.querySelector("#title_result_table")
    const SEARCH_RESULT_HTMLS = SEARCH_RESULTS.map((search_result) => 
      `<tr><td><div title_id="${search_result.title_id}">${search_result.title}</div></td></tr>`)
    TITLE_RESULT_TABLE_SEL.innerHTML = SEARCH_RESULT_HTMLS.join('\n')

    Object.values(document.querySelectorAll("#title_result_table td div")).forEach((sel) => {
        sel.onclick = on_Click_Searched_Webtoon_Title
    })
}

/** 검색된 웹툰 제목을 클릭할 경우, 그 웹툰에 관련된 목차를 출력하기 위해서 */
async function on_Click_Searched_Webtoon_Title(e)
{
  alert(`[MOCK] ${e.path[0].textContent}(${e.path[0].getAttribute("title_id")}) 에 대한 세부 화수 조회 결과가 나와야 함`)
}

main()