/** 반복자에 관한 라이브러리들 */
class Iter
{
  /** 순서를 가진 정수배열을 만들기 위해서 */
  static range(start, stop, step=1)
  {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }
}