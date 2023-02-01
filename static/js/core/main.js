function main()
{
  change_Visible_Of_Process_Div([true, false, false])
  document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
  document.querySelector("#zip_download_button").onclick = on_Click_Zip_Download_Button
}

/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
  change_Visible_Of_Process_Div([true, false, false])
  e.preventDefault()
  
  const TITLE_TO_SEARCH = document.querySelector("#title_search_form input[type='text']").value
  if(TITLE_TO_SEARCH.length == 0) throw new Error("검색할 웹툰명을 입력해주세요!")

  document.querySelector("#title_search_result_list").innerHTML = ""
  document.querySelector("#index_search_result_list").innerHTML = ""
  
  const TITLE_RESULTS = await Rest_Api.search_Webtoon_Titles(TITLE_TO_SEARCH)
  if(TITLE_RESULTS.length == 0) throw new Error("검색결과가 존재하지 않습니다! 검색할 웹툰명이 정확한지 확인해주세요!")

  Update_Title_Results_UI(TITLE_RESULTS)
  Element.add_On_Click_Trigger("#title_search_result_list li", on_Click_Searched_Webtoon_Title)
}
on_Submit_title_Search_Form = Wrap.wrap_With_Try_Alert_Promise(on_Submit_title_Search_Form)

/** 웹툰 제목 검색 결과를 UI에 업데이트시키기 위해서 */
function Update_Title_Results_UI(title_results)
{
  const TITLE_RESULT_HTMLS = title_results.map((title_result) => 
    `<li class="list-group-item webtoon_title_item" title_id="${title_result.title_id}">${title_result.title}</li>`)
  document.querySelector("#title_search_result_list").innerHTML = TITLE_RESULT_HTMLS.join('\n')
}

/** 검색된 웹툰 제목을 클릭할 경우, 그 웹툰에 관련된 목차를 출력하기 위해서 */
async function on_Click_Searched_Webtoon_Title(e)
{
  const CHECKED_WEBTOON_TITLE_ITEMS = document.querySelectorAll("li.webtoon_title_item[class*='checked']")
  CHECKED_WEBTOON_TITLE_ITEMS.forEach((sel) => {
    sel.classList.remove("checked")
    sel.style.background = ""
  })
  
  const SELECTED_ELEMENT = e.target
  SELECTED_ELEMENT.classList.add("checked")
  SELECTED_ELEMENT.style.background = "lightgray"

  
  change_Visible_Of_Process_Div([true, false, false])
  const TITLE_ID_TO_SEARCH = SELECTED_ELEMENT.getAttribute("title_id")
  const MAX_INDEX = await Rest_Api.search_Max_Index(TITLE_ID_TO_SEARCH)

  const INDEX_RESULT_HTMLS = Iter.range(MAX_INDEX, 1-1, -1).map((index) => 
    `<li class="list-group-item webtoon_index_item" title_id="${TITLE_ID_TO_SEARCH}" index="${index}">${index}화</li>`)
  document.querySelector("#index_search_result_list").innerHTML = INDEX_RESULT_HTMLS.join('\n')
  Element.add_On_Click_Trigger("#index_search_result_list li", on_Click_Searched_Webtoon_Index)
  change_Visible_Of_Process_Div([true, true, false])
}
on_Click_Searched_Webtoon_Title = Wrap.wrap_With_Try_Alert_Promise(on_Click_Searched_Webtoon_Title)

/** 검색된 웹툰 화수를 클릭할 경우, 그 선택을 반영시키기 위해서 */
async function on_Click_Searched_Webtoon_Index(e)
{
  const SELECTED_ELEMENT = e.target
  if(SELECTED_ELEMENT.classList.contains("checked")) 
  {
    SELECTED_ELEMENT.classList.remove("checked")
    SELECTED_ELEMENT.style.background = ""
  }
  else
  {
    SELECTED_ELEMENT.classList.add("checked")
    SELECTED_ELEMENT.style.background = "lightgray"
  }

  const CHECKED_WEBTOON_INFOS = document.querySelectorAll("li.webtoon_index_item[class*='checked']")
  if(CHECKED_WEBTOON_INFOS.length > 0) change_Visible_Of_Process_Div([true, true, true])
  else change_Visible_Of_Process_Div([true, true, false])
}
on_Click_Searched_Webtoon_Index = Wrap.wrap_With_Try_Alert_Promise(on_Click_Searched_Webtoon_Index)

/** 선택된 웹툰 및 화수들을 .zip로 압축해서 다운받도록하기 위해서 */
async function on_Click_Zip_Download_Button(_)
{
  const CHECKED_WEBTOON_INFOS = document.querySelectorAll("li.webtoon_index_item[class*='checked']")
  if(CHECKED_WEBTOON_INFOS.length == 0)
    throw new Error("다운로드 받을 웹툰 및 화수를 선택해주세요 !")

  document.querySelector("#download_process_list").innerHTML = `<li class="list-group-item">다운로드 진행중..</li>`
  CHECKED_WEBTOON_INFOS.forEach((sel) => sel.click())
  
  const WEBTOON_INFOS_TO_DOWNLOAD = Object.values(CHECKED_WEBTOON_INFOS).map((sel) => {
      return {title_id:sel.getAttribute("title_id"), index:sel.getAttribute("index")}
  })
  const ZIP_DATA_URL = await Rest_Api.data_Url_From_Webtoons_Zip(WEBTOON_INFOS_TO_DOWNLOAD)
  Browser.download_File(ZIP_DATA_URL, "download.zip")
  
  document.querySelector("#download_process_list").innerHTML = ""
  const AFTER_CHECKED_WEBTOON_INFOS = document.querySelectorAll("li.webtoon_index_item[class*='checked']")
  if(AFTER_CHECKED_WEBTOON_INFOS.length > 0) change_Visible_Of_Process_Div([true, true, true])
  else change_Visible_Of_Process_Div([true, true, false])
}
on_Click_Zip_Download_Button = Wrap.wrap_With_Try_Alert_Promise(on_Click_Zip_Download_Button)

/** 주어진 리스트의 순서에따라서 각 프로세스 블럭의 표시여부를 변경시키기 위해서 
 *
 *  change_Visible_Of_Process_Div([false, true, true]) // '[1]' 번째 블록이 가려지고, 나머지 블록들이 보이게 됨
 */
function change_Visible_Of_Process_Div(isvisibles)
{
  const PROCESS_DIVS = document.querySelectorAll("div.container > div.row > div")
  for(let i=0; i<isvisibles.length; i++)
  {
    // 다운로드가 진행중인 목록이 있을 경우, 가림 요청을 무시시키기 위해서
    if(i==2 && document.querySelectorAll("div.container > div.row > div:nth-child(3) > ul > li").length > 0)
    {
      PROCESS_DIVS[i].style.visibility = ""
      continue
    }
    PROCESS_DIVS[i].style.visibility = (isvisibles[i]) ? "" : "hidden"
  }
}
    
main()