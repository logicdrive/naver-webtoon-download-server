function main()
{
  change_Visible_Of_Process_Div([true, false, false])
  document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
  document.querySelector("#zip_download_button").onclick = on_Click_Zip_Download_Button
  document.querySelector("#add_index_button").onclick = on_Click_Add_Index
}

/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
  e.preventDefault()
  
  const TITLE_TO_SEARCH = document.querySelector("#title_search_form input[type='text']").value
  if(TITLE_TO_SEARCH.length == 0) throw new Error("검색할 웹툰명을 입력해주세요!")

  document.querySelector("#title_search_result_list").innerHTML = ""
  Index_Manager.init_Index_Info()
  change_Visible_Of_Process_Div([true, false, false])
  
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

  Index_Manager.init_Index_Info()
  change_Visible_Of_Process_Div([true, true, false])
}
on_Click_Searched_Webtoon_Title = Wrap.wrap_With_Try_Alert_Promise(on_Click_Searched_Webtoon_Title)


/** 입력한 화수들에 대한 정보를 다운받을 화수들 목록에 추가시키기 위해서 */
async function on_Click_Add_Index(_)
{
  const TITLE_ID = document.querySelector("li.webtoon_title_item[class*='checked']").getAttribute("title_id")
  const START_INDEX = document.querySelector("input#start_index").value
  const END_INDEX = document.querySelector("input#end_index").value

  if(START_INDEX.length == 0 && END_INDEX.length == 0)
    throw new Error("추가시킬 화수를 입력해주세요.")

  if(START_INDEX.length != 0 && END_INDEX.length != 0)
    await Index_Manager.add_Index_Info_By_Range(TITLE_ID, Number(START_INDEX), Number(END_INDEX))
  else
    if(START_INDEX.length != 0) await Index_Manager.add_Index_Info(TITLE_ID, Number(START_INDEX))
    else await Index_Manager.add_Index_Info(TITLE_ID, Number(END_INDEX))

  document.querySelector("input#start_index").value = ""
  document.querySelector("input#end_index").value = ""
}
on_Click_Add_Index = Wrap.wrap_With_Try_Alert_Promise(on_Click_Add_Index)

/** 목차 UI 초기화, 조회등을 일괄적으로 수행하기 위해서 */
class Index_Manager
{
  static _current_index_infos = []

  /** 모든 목차 정보를 초기화시키기 위해서 */
  static init_Index_Info()
  {
    Index_Manager._current_index_infos = []
    document.querySelector("#index_search_result_list").innerHTML = ""
  }

  /** 특정 범위의 목차를 조회해서 항목에 추가시키기 위해서 */
  static async add_Index_Info_By_Range(title_id, start_index, end_index)
  {
    if(end_index < start_index) throw new Error("화수 범위가 올바르지 않습니다.")
    if(start_index == end_index)
    {
      await Index_Manager.add_Index_Info(title_id, start_index)
      return
    }

    const INDEX_INFOS = await Rest_Api.search_Index_Infos(title_id, start_index, end_index)
    Index_Manager.update_Current_Index_Infos(INDEX_INFOS)
    Index_Manager._update_Index_Result_UI(title_id)
  }

  /** 특정 목차를 조회해서 항목에 추가시키기 위해서 */
  static async add_Index_Info(title_id, index)
  {
    const INDEX_INFOS = await Rest_Api.search_Index_Infos(title_id, index, index)
    Index_Manager.update_Current_Index_Infos(INDEX_INFOS)
    Index_Manager._update_Index_Result_UI(title_id)
  }

  /** 검색된 목차 정보를 기반으로 다운로드시킬 목차들의 목록을 업데이트하기 위해서 */
  static async update_Current_Index_Infos(index_infos)
  {
    const CURRENT_INDEX_INFO_INDEXES = Index_Manager._current_index_infos.map((index_info) => index_info.index)
    for(let index_info of index_infos)
    {
      if(CURRENT_INDEX_INFO_INDEXES.includes(index_info.index)) continue
      Index_Manager._current_index_infos.push(index_info)
    }
    Index_Manager._current_index_infos.sort((info_a, info_b) => info_a.index - info_b.index) 
  }
  
  /** 다운로드시킬 목차들의 목록을 UI에 반영시키기 위해서 */
  static _update_Index_Result_UI(title_id)
  {
    const INDEX_RESULT_HTMLS = Index_Manager._current_index_infos.map((index_info) => `<li class="list-group-item webtoon_index_item" title_id="${title_id}" index="${index_info.index}">${index_info.name}</li>`)
    document.querySelector("#index_search_result_list").innerHTML = INDEX_RESULT_HTMLS.join('\n')
    Element.add_On_Click_Trigger("li.webtoon_index_item", Index_Manager._on_Click_Searched_Webtoon_Index)

    change_Visible_Of_Process_Div([true, true, true])
  }

  /** 목차 엘리먼트를 클릭했을 경우, 그 목차를 목록에서 삭제시키기 위해서 */
  static _on_Click_Searched_Webtoon_Index(e)
  {
    const TITLE_ID = e.target.getAttribute("title_id")
    const SELECTED_INDEX = e.target.getAttribute("index")
    Index_Manager._current_index_infos = Index_Manager._current_index_infos.filter((index_info) => index_info.index != SELECTED_INDEX)

    if(Index_Manager._current_index_infos.length > 0) Index_Manager._update_Index_Result_UI(TITLE_ID)
    else
    {
      Index_Manager.init_Index_Info()
      change_Visible_Of_Process_Div([true, true, false])
    }
  }
}

/** 선택된 웹툰 및 화수들을 .zip로 압축해서 다운받도록하기 위해서 */
async function on_Click_Zip_Download_Button(_)
{
  const CHECKED_WEBTOON_INFOS = document.querySelectorAll("li.webtoon_index_item")
  if(CHECKED_WEBTOON_INFOS.length == 0)
    throw new Error("다운로드 받을 웹툰 및 화수를 선택해주세요 !")

  document.querySelector("#download_process_list").innerHTML = `<li class="list-group-item">다운로드 진행중..</li>`
  CHECKED_WEBTOON_INFOS.forEach((sel) => sel.click())

  const TITLE_ID = document.querySelector("li.webtoon_title_item[class*='checked']").getAttribute("title_id")
  const WEBTOON_INFOS_TO_DOWNLOAD = Object.values(CHECKED_WEBTOON_INFOS).map((sel) => {
      return {title_id:TITLE_ID, index:sel.getAttribute("index")}
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