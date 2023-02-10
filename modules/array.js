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

  /** 주어진 배열을 주어진 범위만큼 자른 2차원 배열을 반환시킴 */
  static range_Split(array, range)
  {
    let range_split_array = []
    for(let index=0; index<array.length; index+=range)
      range_split_array.push(array.slice(index, index+range))
    return range_split_array
  }
}

export default Array_Lib