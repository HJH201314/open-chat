let SERVER_HOST = '';
if (import.meta.env.MODE === 'development') {
  SERVER_HOST = '';
} else {
  SERVER_HOST = window.location.host;
}

let SERVER_PATH = '';
if (window.location.host == 'app.fcraft.cn') {
  SERVER_PATH = '/chat';
}

export const SERVER_ORIGIN_API_URL = SERVER_HOST + SERVER_PATH + '/api/origin';

export const SERVER_CLOUD_API_URL = SERVER_HOST + SERVER_PATH + '/api/cloud';

export const SERVER_NEXT_API_URL = SERVER_HOST + SERVER_PATH + '/api/next';

export const OPENAI_API_URL = 'https://api.openai.com/v1/';