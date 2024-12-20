import {Platform} from 'react-native';

const domain = 'http://tiktok.apprankings.net';

export function get_apps_list() {
  return `${domain}/list_apps?platform=${Platform.OS}`;
}
