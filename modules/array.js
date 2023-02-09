/** 배열 관련 처리의 일관성을 위한 라이브러리 */
class Array_Lib
{
  /** 주어진 배열에서 특정 값의 개수를 반환받기 위해서 */
  static count_Value(array, search_value)
  {
    let count = 0
    for(let value of array)
        if(value == search_value) count += 1
    return count
  }
}

export default Array_Lib