import { EggLogger } from 'egg';
import { HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, HTTPQuery, Inject } from '@eggjs/tegg';
import { TencentService } from "@/module/audio/service/TencentService";
import { CommonResult } from "../../../model/CommonResult";

@HTTPController({
  path: '/audio',
})
export class AudioController {
  @Inject()
  logger: EggLogger;
  @Inject()
  tencentService: TencentService;

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/tencent/upload',
  })
  async tencentUpload(@HTTPBody() audioData: {
    data: string;
  }) {
    const res = await this.tencentService.uploadAudioFile(audioData.data);
    if (res) {
      return CommonResult.success({
        taskId: res
      })
    } else {
      return CommonResult.fail();
    }
  }

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/tencent/check',
  })
  async tencentCheck(@HTTPQuery({name: 'taskId'}) taskId: string) {
    const res = await this.tencentService.checkAudioStatus(parseInt(taskId));
    if (res) {
      return CommonResult.success({
        status: res.Status,
        statusStr: res.StatusStr,
        audioDuration: res.AudioDuration,
        result: res.Result,
        resultDetail: res.ResultDetail,
      })
    } else {
      return CommonResult.fail();
    }
  }
}
