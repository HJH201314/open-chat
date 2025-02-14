import { type MaybeRefOrGetter, ref, toValue, watchEffect } from 'vue';

type Command = {
  raw: string;
  name: string;
  values: string[]; // 逗号分隔的值
  data: { [key: string]: string }; // 键值对形式的值
};

export class CommandParser {
  input: string;
  commands: Command[];
  commandMap: { [name: string]: Command };

  constructor(input: string) {
    this.input = input;
    this.commands = [];
    this.commandMap = {};
    this.parse();
  }

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

export const useCommandParser = (input: MaybeRefOrGetter<string>) => {
  const parser = new CommandParser(toValue(input));
  const commands = ref<Command[]>([]);
  const commandMap = ref<{ [name: string]: Command }>({});

  watchEffect(() => {
    parser.parse(toValue(input));
    commands.value = parser.getCommands();
    commandMap.value = parser.getCommandMap();
  });

  return {
    commands,
    commandMap,
  }
};
