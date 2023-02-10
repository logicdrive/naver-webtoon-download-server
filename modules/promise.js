import Array_Lib from "./array.js"

/** Promise 관련 처리의 일관성을 위한 라이브러리 */
class Promise_Lib
{
  /** 특정한 개수들을 윈도우로 병렬처리를 수행하기 위해서 */
  static async parallel_Processing(process_datas, parallel_degree, resolve_callback)
  {
    const ENTRY_SPLITS = Array_Lib.range_Split(Object.entries(process_datas), parallel_degree)
    for(let entry_split of ENTRY_SPLITS)
    {
      const REQUEST_PROMISES = entry_split.map((entry) => {
        return new Promise((resolve) => {
          resolve_callback(resolve, entry[1], Number(entry[0]))
        })
      })
      await Promise.all(REQUEST_PROMISES)
    }
  }
}

export default Promise_Lib