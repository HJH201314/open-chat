import * as User from "./service/userService";
import * as Chat from "./service/chatService";
import * as Gpt from "./service/gptService";
import * as Star from "./service/starService";
import * as Manage from "./service/manageService";
import * as voiceService from "./cloud/voiceService";

export default {
  user: User,
  gpt: Gpt,
  chat: Chat,
  star: Star,
  manage: Manage,
  cloud: {
    voice: voiceService,
  }
}