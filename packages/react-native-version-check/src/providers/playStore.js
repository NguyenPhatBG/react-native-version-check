// @flow
import { getVersionInfo } from '../versionInfo';

import { IProvider, IVersionAndStoreUrl } from './types';
import gplay from 'google-play-scraper';

export type PlayStoreGetVersionOption = {
  packageName?: string,
  fetchOptions?: any,
  ignoreErrors?: boolean,
};

export interface IPlayStoreProvider extends IProvider {
  getVersion: PlayStoreGetVersionOption => Promise<IVersionAndStoreUrl>;
}

function error(text: string) {
  return {
    message:
      "Parse Error. Your app's play store page doesn't seem to have latest app version info.",
    text,
  };
}

class PlayStoreProvider implements IProvider {
  getVersion(option: PlayStoreGetVersionOption): Promise<IVersionAndStoreUrl> {
    const opt = option || {};
    try {
      if (!opt.packageName) {
        opt.packageName = getVersionInfo().getPackageName();
      }
      const storeUrl = `https://play.google.com/store/apps/details?id=${opt.packageName}&hl=en`;
      gplay.app({ appId: opt.packageName }).then(result => {
        return Promise.resolve({ version: result.version, storeUrl });
      });
    } catch (e) {
      if (opt.ignoreErrors) {
        console.warn(e); // eslint-disable-line no-console
      } else {
        throw e;
      }
    }
  }
}

export default new PlayStoreProvider();
