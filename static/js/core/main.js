document.querySelector("#title_search_form").addEventListener("submit", async (e) => {
    e.preventDefault()
    
    const SEARCH_TITLE = document.querySelector("#title_search_form input[type='text']").value
    if(SEARCH_TITLE.length == 0)
    {
      alert("검색할 웹툰명을 입력해주세요!")
      return
    }

    const RES = await Request.JSON_Request(`/api/v1/webtoon?type=title&keyword=${SEARCH_TITLE}`, "GET")
    if(RES.is_error)
    {
      alert(`에러가 발생했습니다!\n${RES.message}`)
      return
    }

    const SEARCH_RESULTS = RES.result
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
        sel.addEventListener("click", (e) => {
            alert(`[MOCK] ${e.path[0].textContent}(${e.path[0].getAttribute("title_id")}) 에 대한 세부 화수 조회 결과가 나와야 함`)
        })
    })
})