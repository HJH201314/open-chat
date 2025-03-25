import { ApiSchemaProblemType } from '@/api/gen/data-contracts.ts';

enum ProblemCategory {
  Option = 'option',
  Text = 'text',
  Unknown = 'unknown',
}

export function getProblemCategory(problemTypeEnum?: string): ProblemCategory {
  switch (problemTypeEnum) {
    case ApiSchemaProblemType.EnumSingleChoice:
    case ApiSchemaProblemType.EnumMultipleChoice:
    case ApiSchemaProblemType.EnumTrueFalse:
      return ProblemCategory.Option;
    case ApiSchemaProblemType.EnumFillBlank:
    case ApiSchemaProblemType.EnumShortAnswer:
      return ProblemCategory.Text;
  }
  return ProblemCategory.Unknown;
}

export function getProblemTypeName(problemTypeEnum: string): string {
  switch (problemTypeEnum) {
    case ApiSchemaProblemType.EnumSingleChoice:
      return '单选题';
    case ApiSchemaProblemType.EnumMultipleChoice:
      return '多选题';
    case ApiSchemaProblemType.EnumShortAnswer:
      return '简答题';
    case ApiSchemaProblemType.EnumFillBlank:
      return '填空题';
    case ApiSchemaProblemType.EnumTrueFalse:
      return '判断题';
  }
  return '未知题型';
}
