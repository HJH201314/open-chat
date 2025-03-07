import { type MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';

type JSONCommand = {
  name: string;
  data: { [key: string]: any };
};

type Command = {
  raw: string;
  name: string;
  values: string[]; // 逗号分隔的值
  data: { [key: string]: string }; // 键值对形式的值
};

export class CommandParser {
  private readonly mayBeJSON: boolean;
  input: string;
  commands: Command[];
  commandMap: { [name: string]: Command };

  constructor(input: string, mayBeJSON = true) {
    this.input = input;
    this.commands = [];
    this.commandMap = {};
    this.mayBeJSON = mayBeJSON;
    this.parse();
  }

  /**
   * 解析字符串格式的指令
   * @param input
   */
  parse(input?: string) {
    if (input) this.input = input;
    this.commands = [];
    this.commandMap = {};

    // 正则表达式匹配所有指令
    const regex = /\[(.*?):(.*?)]/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(this.input)) !== null) {
      const name = match[1];
      const valuePairs = match[2];
      const command: Command = { name, raw: match[0], values: [], data: {} };

      valuePairs.split(',').forEach((valuePair) => {
        const keyValue = valuePair.split('=');
        if (keyValue.length === 2) {
          const key = keyValue[0];
          const value = keyValue[1];
          command.values.push(value);
          command.data[key] = value;
        } else {
          command.values.push(valuePair);
        }
      });

      this.commands.push(command);
      this.commandMap[name] = command;
    }
  }

  /**
   * 解析 JSON 格式的指令
   * @param input
   */
  parseJSON(input?: string): CommandParser {
    if (!this.mayBeJSON) return this;
    if (input) this.input = input;

    this.commands = [];
    this.commandMap = {};
    try {
      const cmd = JSON.parse(this.input) as JSONCommand;
      if (cmd.name) {
        const command: Command = { name: cmd.name, raw: this.input, values: [], data: cmd.data };
        for (const key in cmd.data) {
          command.values.push(cmd.data[key]);
        }
        this.commands.push(command);
        this.commandMap[cmd.name] = command;
      }
      return this;
    } catch (_) {
      // parse json error
      return this;
    }
  }

  getCommands() {
    return this.commands;
  }

  getCommandMap() {
    return this.commandMap;
  }

  getCommandByName(name: string) {
    return this.commands.find((command) => command.name === name);
  }
}

export const useCommandParser = (input: MaybeRefOrGetter<string>, mayBeJSON: boolean = false) => {
  const parser = new CommandParser('', mayBeJSON);
  const commands = ref<Command[]>([]);
  const commandMap = ref<{ [name: string]: Command }>({});

  watchEffect(() => {
    const value = toValue(input);
    if (value.startsWith('{')) {
      parser.parseJSON(value);
    } else {
      parser.parse(value);
    }
    commands.value = parser.getCommands();
    commandMap.value = parser.getCommandMap();
  });

  return {
    commands,
    commandMap,
  };
};
