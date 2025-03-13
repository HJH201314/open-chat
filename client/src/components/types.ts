export type CusCommonProps = {
  /**
   * 组件布局使用的单位
   * `em` - 根据组件所继承的文字大小
   * `rem` - 根据<html>根元素的文字大小
   */
  sizeUnit: 'em' | 'rem';
  /**
   * 组件的缩放倍数
   */
  scale: number;
}