import * as UserService from "./service/userService";
import * as ChatService from "./service/chatService";
import * as GptService from "./service/gptService";
import * as StarService from "./service/starService";
import * as ManageService from "./service/manageService";
import * as voiceService from "./cloud/voiceService";

export default {
  user: UserService,
  gpt: GptService,
  chat: ChatService,
  star: StarService,
  manage: ManageService,
  cloud: {
    voice: voiceService,
  }
}