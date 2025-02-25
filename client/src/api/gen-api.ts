import { Chat } from '@/api/gen/Chat.ts';
import { genApiClient } from '@/api/base.ts';
import { Manage } from '@/api/gen/Manage.ts';
import { User } from '@/api/gen/User.ts';

export default {
  Chat: new Chat(genApiClient),
  Manage: new Manage(genApiClient),
  User: new User(genApiClient),
}