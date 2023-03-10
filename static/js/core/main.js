function main()
{
  document.querySelector("#title_search_form").onsubmit = on_Submit_title_Search_Form
  document.querySelector("#zip_download_button").onclick = on_Click_Zip_Download_Button
  document.querySelector("#add_index_button").onclick = on_Click_Add_Index
  Process_Visible_Manager.change_Process_Visible_Level(1)
}


/** 웹툰 제목을 검색할 경우, 그에 대한 검색결과를 출력하기 위해서 */
async function on_Submit_title_Search_Form(e)
{
  e.preventDefault()
  
  const TITLE_TO_SEARCH = document.querySelector("#title_search_form input[type='text']").value
  if(TITLE_TO_SEARCH.length == 0) throw new Error("검색할 웹툰명을 입력해주세요!")

  const TITLE_SEARCH_RESULTS = await Title_Manager.search_Webtoon_Titles(TITLE_TO_SEARCH)
  if(TITLE_SEARCH_RESULTS.length == 0) throw new Error("검색결과가 존재하지 않습니다! 검색할 웹툰명이 정확한지 확인해주세요!")
  Process_Visible_Manager.change_Process_Visible_Level(1)

  Title_Manager.update_Webtoon_Title_Result_UI(TITLE_SEARCH_RESULTS)
}
on_Submit_title_Search_Form = Wrap.wrap_With_Try_Alert_Promise(on_Submit_title_Search_Form)

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

/** 선택된 웹툰 및 화수들을 .zip로 압축해서 다운받도록하기 위해서 */
async function on_Click_Zip_Download_Button(_)
{
  const SELECTED_WEBTOON_INFOS = document.querySelectorAll("li.webtoon_index_item")
  if(SELECTED_WEBTOON_INFOS.length == 0)
    throw new Error("다운로드 받을 웹툰 및 화수를 선택해주세요 !")

  const TITLE_NAME = document.querySelector("li.webtoon_title_item[class*='checked']").textContent
  const TITLE_ID = document.querySelector("li.webtoon_title_item[class*='checked']").getAttribute("title_id")
  const WEBTOON_INFOS_TO_DOWNLOAD = Object.values(SELECTED_WEBTOON_INFOS).map((sel) => {
      return {title_id:TITLE_ID, index:sel.getAttribute("index"), directory_name:sel.textContent}
  })

  await Download_Manager.download_Webtoons(WEBTOON_INFOS_TO_DOWNLOAD, TITLE_NAME)
}
on_Click_Zip_Download_Button = Wrap.wrap_With_Try_Alert_Promise(on_Click_Zip_Download_Button)


/** 타이틀 UI 초기화, 조회등을 일괄적으로 수행하기 위해서 */
class Title_Manager
{
  /** 웹툰 제목 키워드를 이용해서 검색하기 위해서 */
  static async search_Webtoon_Titles(title_keyword)
  {
    const TITLE_RESULTS = await Rest_Api.search_Webtoon_Titles(title_keyword)
    return TITLE_RESULTS
  }

  /** 검색된 키워드들을 UI로 출력시키기 위해서 */
  static update_Webtoon_Title_Result_UI(title_results)
  {
    const TITLE_RESULT_HTMLS = title_results.map((title_result) => 
      `<li class="list-group-item webtoon_title_item" title_id="${title_result.title_id}">${title_result.title}</li>`)
    document.querySelector("#title_search_result_list").innerHTML = TITLE_RESULT_HTMLS.join('\n')
    Element.add_On_Click_Trigger("#title_search_result_list li", Title_Manager._on_Click_Searched_Webtoon_Title)
  }

  /** 검색된 웹툰 제목을 클릭할 경우, 클릭된 항목을 강조시키기 위해서 */
  static async _on_Click_Searched_Webtoon_Title(e)
  {
    const CHECKED_WEBTOON_TITLE_ITEMS = document.querySelectorAll("li.webtoon_title_item[class*='checked']")
    CHECKED_WEBTOON_TITLE_ITEMS.forEach((sel) => {
      sel.classList.remove("checked")
      sel.style.background = ""
    })
    
    const SELECTED_ELEMENT = e.target
    SELECTED_ELEMENT.classList.add("checked")
    SELECTED_ELEMENT.style.background = "lightgray"
    Process_Visible_Manager.change_Process_Visible_Level(2)
  }
}
Title_Manager._on_Click_Searched_Webtoon_Title = Wrap.wrap_With_Try_Alert_Promise(Title_Manager._on_Click_Searched_Webtoon_Title)


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
    Index_Manager._update_Current_Index_Infos(INDEX_INFOS)
    Index_Manager._update_Index_Result_UI(title_id)
  }

  /** 특정 목차를 조회해서 항목에 추가시키기 위해서 */
  static async add_Index_Info(title_id, index)
  {
    const INDEX_INFOS = await Rest_Api.search_Index_Infos(title_id, index, index)
    Index_Manager._update_Current_Index_Infos(INDEX_INFOS)
    Index_Manager._update_Index_Result_UI(title_id)
  }

  /** 검색된 목차 정보를 기반으로 다운로드시킬 목차들의 목록을 업데이트하기 위해서 */
  static async _update_Current_Index_Infos(index_infos)
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
    Process_Visible_Manager.change_Process_Visible_Level(4)
  }

  /** 목차 엘리먼트를 클릭했을 경우, 그 목차를 목록에서 삭제시키기 위해서 */
  static _on_Click_Searched_Webtoon_Index(e)
  {
    const TITLE_ID = e.target.getAttribute("title_id")
    const SELECTED_INDEX = e.target.getAttribute("index")
    Index_Manager._current_index_infos = Index_Manager._current_index_infos.filter((index_info) => index_info.index != SELECTED_INDEX)

    if(Index_Manager._current_index_infos.length > 0) Index_Manager._update_Index_Result_UI(TITLE_ID)
    else Process_Visible_Manager.change_Process_Visible_Level(2)
  }
}
Index_Manager._on_Click_Searched_Webtoon_Index = Wrap.wrap_With_Try_Alert_Promise(Index_Manager._on_Click_Searched_Webtoon_Index)


/** 다운로드 UI 정보들을 일괄적으로 관리하기 위해서 */
class Download_Manager
{
  static _current_download_infos = []

  /** 주어진 웹툰 정보들을 기반으로 다운로드를 수행하기 위해서 */
  static async download_Webtoons(webtoon_infos, title_name)
  {  
    const ZIP_NAME = Download_Manager._get_Download_Zip_Name(title_name)
    Download_Manager._add_To_Download_List(ZIP_NAME)
    Download_Manager._update_download_UI()
    Index_Manager.init_Index_Info()
    
    const ZIP_DATA_URL = await Rest_Api.data_Url_From_Webtoons_Zip(webtoon_infos)
    Browser.download_File(ZIP_DATA_URL, ZIP_NAME)
    
    Download_Manager._delete_From_Download_List(ZIP_NAME)
    Download_Manager._update_download_UI()
    Process_Visible_Manager.change_Process_Visible_Level(3)
  }

  /** 주어진 타이틀 이름을 이용해서 사용할 zip 이름을 생성시키기 위해서 */
  static _get_Download_Zip_Name(title_name)
  {
    const CURRENT_DATE_STR = Date_Lib.date_To_String(Date_Lib.date_Now(), "yyyyMMdd_hhmmss")
    const ZIP_NAME = `${title_name}_${CURRENT_DATE_STR}.zip`
    return ZIP_NAME
  }

  /** 다운로드 리스트에 다운로드시킬 파일명을 추가시키기 위해서 */
  static _add_To_Download_List(file_name)
  {
    Download_Manager._current_download_infos.push(file_name)
  }

  /** 다운로드 리스트에서 특정 파일명을 삭제시키기 위해서 */
  static _delete_From_Download_List(file_name)
  {
    Download_Manager._current_download_infos = Download_Manager._current_download_infos.filter((download_info) => download_info != file_name)
  }

  /** 다운로드 관련 UI를 업데이트시키기 위해서 */
  static _update_download_UI()
  {
    const INDEX_RESULT_HTMLS = Download_Manager._current_download_infos.map((download_info) => `<li class="list-group-item">파일명 : ${download_info}<br/>진행상태 : 다운로드 진행중...</li>`)
    document.querySelector("#download_process_list").innerHTML = INDEX_RESULT_HTMLS.join('\n')
  }
}


/** 진행과정 블록의 표시여부를 일괄적으로 관리하기 위해서 */
class Process_Visible_Manager
{
  /** 진행과정이 보이는 수준을 조절하기 위해서 */
  static change_Process_Visible_Level(visible_level)
  {
    switch(visible_level)
    {
      // 타이틀 검색 결과까지 모든 과정을 초기상태로 되돌리기 위해서
      case 1 :
        document.querySelector("#title_search_result_list").innerHTML = ""
        Index_Manager.init_Index_Info()
        Process_Visible_Manager._change_Visible_Of_Process_Div([true, false, false])
        return
  
      // 목차 검색 결과까지의 과정을 초기상태로 되돌리기 위해서
      case 2 :
        Index_Manager.init_Index_Info()
        Process_Visible_Manager._change_Visible_Of_Process_Div([true, true, false])
        return
  
      // 다운로드 결과까지의 과정을 초기 상태로 되돌리기 위해서
      case 3 :
        Process_Visible_Manager._change_Visible_Of_Process_Div([true, true, false])
        return
  
      // 모든 과정을 보이도록 하기 위해서
      case 4 :
        Process_Visible_Manager._change_Visible_Of_Process_Div([true, true, true])
        return
    }
  }
  
  /** 주어진 리스트의 순서에따라서 각 프로세스 블럭의 표시여부를 변경시키기 위해서 
   *
   *  Process_Visible_Manager._change_Visible_Of_Process_Div([false, true, true]) // '[1]' 번째 블록이 가려지고, 나머지 블록들이 보이게 됨
   */
  static _change_Visible_Of_Process_Div(isvisibles)
  {
    const PROCESS_DIVS = document.querySelectorAll("div.container > div.row > div")
    for(let i=0; i<isvisibles.length; i++)
    {
      // 다운로드가 진행중인 목록이 있을 경우, 가림 요청을 무시시키기 위해서
      if(i==2 && document.querySelectorAll("div.container > div.row > div:nth-child(3) > ul > li").length > 0)
      {
        PROCESS_DIVS[i].style.visibility = "visible"
        continue
      }
      PROCESS_DIVS[i].style.visibility = (isvisibles[i]) ? "visible" : "hidden"
    }
  }     
}


main()