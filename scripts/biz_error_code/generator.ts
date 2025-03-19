import * as fs from 'fs';
import * as path from 'path';
import { Liquid } from 'liquidjs';

interface ErrorDefinition {
  BizCode: number;
  HttpCode: number;
  Msg: string;
}

type ErrorDefinitions = Record<string, ErrorDefinition>;

async function main() {
  // 读取错误定义
  const errorDefs = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'errors.json'), 'utf-8'),
  ) as ErrorDefinitions;

  // 准备模板数据
  const templateDataGO = {
    entries: Object.entries(errorDefs).map(([name, err]) => ({
      name,
      httpCode: err.HttpCode,
      bizCode: err.BizCode,
      msg: err.Msg.replace(/"/g, '\\"'),
    })),
  };
  const templateDataTS = {
    entries: Object.entries(errorDefs).map(([name, err]) => ({
      name,
      httpCode: err.HttpCode,
      bizCode: err.BizCode,
      msg: err.Msg.replace(/'/g, "\\'"),
    })),
  };

  // 初始化 Liquid 引擎
  const engine = new Liquid({
    root: path.join(__dirname, 'templates'),
    extname: '.tmpl',
    strictFilters: true,
  });

  // 生成代码
  const [goCode, tsCode] = await Promise.all([
    engine.renderFile('go', templateDataGO),
    engine.renderFile('ts', templateDataTS),
  ]);

  // 写入文件
  fs.writeFileSync(path.join(__dirname, '..', '..', 'server', 'internal', 'constants', 'error_biz.const.go'), goCode);
  fs.writeFileSync(path.join(__dirname, '..', '..', 'client', 'src', 'constants', 'bizErrorCode.ts'), tsCode);
}

main().then(() => console.log('Done!'));
