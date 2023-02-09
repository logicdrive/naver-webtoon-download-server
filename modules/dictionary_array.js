import Array_Lib from "./array.js"

/** 딕셔너리로 이루어진 배열을 효율적으로 다루기 위한 라이브러리 */
class Dictionary_Array
{
  /** 유일한 딕셔너리로 이루어진 배열을 반환받기 위해서 */
  static unique_Dictionary_Array(array)
  {
    let unique_dictionary_array = []
    for(let dic of array)
        if(!Dictionary_Array.is_Exist_Dictionary_In_Array(unique_dictionary_array, dic))
            unique_dictionary_array.push(dic)
    return unique_dictionary_array
  }

  /** 특정 딕셔너리의 존재 여부를 반환받기 위해서 */
  static is_Exist_Dictionary_In_Array(array, search_dic)
  {
    return array.filter((dic) => Dictionary_Array.is_Dictionary_Equal(dic, search_dic)).length == 1
  }

  /** 두 딕셔너리가 동일한지 여부를 반환받기 위해서 */
  static is_Dictionary_Equal(dic_1, dic_2)
  {
    if(Object.keys(dic_1).length != Object.keys(dic_2).length) return false
    const IS_KEY_VAL_EQUAL = Object.keys(dic_1).map((key) => dic_1[key] == dic_2[key])
    return Array_Lib.count_Value(IS_KEY_VAL_EQUAL, true) == IS_KEY_VAL_EQUAL.length
  }
}

export default Dictionary_Array