import React from 'react';
import {Alert, Platform, Text, NativeModules} from 'react-native';

function alertInfo(
  title: string,
  content: string,
  canCancel: boolean,
  ok: () => void,
) {
  let options = !canCancel
    ? [
        {
          text: 'OK',
          onPress: ok,
        },
      ]
    : [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'OK',
          onPress: ok,
        },
      ];
  Alert.alert(title, content, options, {cancelable: false});
}

function opoFontFix() {
  if (Platform.OS !== 'android') {
    return;
  }

  const oldRender = Text.render;
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{fontFamily: 'Roboto'}, origin.props.style],
    });
  };
}

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getSystemLocale(): string {
  let locale: string | undefined = undefined;
  // iOS
  if (
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    // Android
  } else if (NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
  }

  if (typeof locale === 'undefined') {
    console.log('Couldnt get locale');
    return 'en';
  }

  return locale;
}

export {alertInfo, opoFontFix, makeid, getSystemLocale};
