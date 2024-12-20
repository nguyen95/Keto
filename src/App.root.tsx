import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import CodePush from 'react-native-code-push';
import AppStyle from './shared/ui/styles/app.style';
import App from './App';

const codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

function bootstrap() {
  StatusBar.setBackgroundColor(AppStyle.Color.Main);
  StatusBar.setBarStyle('light-content');
  LogBox.ignoreLogs(['Remote debugger']); //Remove unnecessary warnings
  class Root extends React.Component {
    render() {
      return <App />;
    }
  }
  return CodePush(codePushOptions)(Root);
}

module.exports = bootstrap;
