function main()
{
  document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
  document.querySelector("#zip_download_button").onclick = on_Click_Zip_Download_Button
}

/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
  e.preventDefault()
  
  const TITLE_TO_SEARCH = document.querySelector("#title_search_form input[type='text']").value
  if(TITLE_TO_SEARCH.length == 0) throw new Error("검색할 웹툰명을 입력해주세요!")

  const TITLE_RESULTS = await Rest_Api.search_Webtoon_Titles(TITLE_TO_SEARCH)
  if(TITLE_RESULTS.length == 0) throw new Error("검색결과가 존재하지 않습니다! 검색할 웹툰명이 정확한지 확인해주세요!")

  Update_Title_Results_UI(TITLE_RESULTS)
  Element.add_On_Click_Trigger("#title_result_table td div", on_Click_Searched_Webtoon_Title)
}
on_Submit_title_Search_Form = Wrap.wrap_With_Try_Alert_Promise(on_Submit_title_Search_Form)

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
  const TITLE_ID_TO_SEARCH = e.target.getAttribute("title_id")
  const MAX_INDEX = await Rest_Api.search_Max_Index(TITLE_ID_TO_SEARCH)

  const INDEX_RESULT_HTMLS = Iter.range(1, MAX_INDEX+1).map((index) => 
    `<tr><td><div><input type="checkbox" class="webtoon_index_checkbox" title_id="${TITLE_ID_TO_SEARCH}" index="${index}">${index}화</div></td></tr>`)
  document.querySelector("#index_result_table").innerHTML = INDEX_RESULT_HTMLS.join('\n')
}
on_Click_Searched_Webtoon_Title = Wrap.wrap_With_Try_Alert_Promise(on_Click_Searched_Webtoon_Title)

async function on_Click_Zip_Download_Button(e)
{
  const CHECKED_WEBTOON_INFOS = document.querySelectorAll("input.webtoon_index_checkbox:checked")
  if(CHECKED_WEBTOON_INFOS.length == 0)
    throw new Error("다운로드 받을 웹툰 및 화수를 선택해주세요 !")

  const WEBTOON_INFOS_TO_DOWNLOAD = Object.values(document.querySelectorAll("input.webtoon_index_checkbox:checked")).map((sel) => {
      return {title_id:sel.getAttribute("title_id"), index:sel.getAttribute("index")}
  })

  const ZIP_DATA_URL = await Rest_Api.data_Url_From_Webtoons_Zip(WEBTOON_INFOS_TO_DOWNLOAD)
  Browser.download_File(ZIP_DATA_URL, "download.zip")
}
on_Click_Zip_Download_Button = Wrap.wrap_With_Try_Alert_Promise(on_Click_Zip_Download_Button)
       
main()