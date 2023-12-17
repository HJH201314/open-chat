import * as User from "./service/userService";
import * as Gpt from "./service/gptService";
import * as Star from "./service/starService";
import * as Manage from "./service/manageService";

export default {
  user: User,
  gpt: Gpt,
  star: Star,
  manage: Manage,
}