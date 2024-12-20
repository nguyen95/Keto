if (!__DEV__) {
  console.log = () => {};
  // console.error = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.trace = () => {};
}

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {configure} from 'mobx';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {LogBox, StyleSheet, View} from 'react-native';
import CodePush, {DownloadProgress} from 'react-native-code-push';
import Toast from 'react-native-easy-toast';
import messaging from '@react-native-firebase/messaging';
import UICommon from './shared/ui/containers/ui_common';
import AuthNavigation from './navigator/auth_navigator';
import MealsSelectionNavigation from './navigator/meals_selection_navigation';
import BottomTabbar from './navigator/tabbar_navigator';
import ExerciseSelection from './screens/meal_selection/exercise';
import {getDataLocal, saveDataLocal} from './services/storage';
import {MealSelectionType} from './shared/objects/meal_selection';
import CodePushStore from './shared/store/codepush';
import LanguageStore from './shared/store/language';
import SubStore from './shared/store/sub';
import UIStore from './shared/store/ui';
import UserStore from './shared/store/user';
import MealSelection from './shared/ui/private/meal_selection';
import {LANGUAGE_KEY} from './utils/config/setting';
import {alertInfo, getSystemLocale, opoFontFix} from './utils/functions';
import PersonStore from './screens/person/store';

opoFontFix();
LogBox.ignoreAllLogs(true);

configure({
  enforceActions: 'never',
});

const codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

type AppProps = {};

const Stack = createStackNavigator();

const App: React.FC<AppProps> = observer(() => {
  const [userStore] = useState(() => new UserStore());
  const [uiStore] = useState(() => new UIStore());
  const [subStore] = useState(() => new SubStore());
  const [codePushStore] = useState(() => new CodePushStore());
  const [langStore] = useState(() => new LanguageStore());
  const [personStore] = useState(() => new PersonStore(langStore));

  const [upToDate, setUpToDate] = useState(true);
  const [codepushError, setCodepushError] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  const checkForUpdate = async () => {
    console.log('checking update');
    const deploymentKey = codePushStore.deploymentKey;
    console.log('deloyment key ', deploymentKey);
    const updateData = await CodePush.checkForUpdate(deploymentKey);
    console.log('deloyment key ', updateData);
    if (!updateData) {
      return;
    } else {
      setIsMandatory(updateData.isMandatory);
      await onUpToDate();
    }
  };

  const handleCodepushUpdate = async (numberTry: number = 3) => {
    const deploymentKey = codePushStore.deploymentKey;
    const syncOption = {
      // updateDialog: true,
      installMode: CodePush.InstallMode.ON_NEXT_RESTART,
      mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
      deploymentKey,
    };
    // Check update new version
    uiStore.showLoading(
      'downloading_codepush',
      'Checking new version and installing ...',
    );
    await CodePush.sync(
      syncOption,
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
    if (upToDate === true) {
      uiStore.hideLoading('downloading_codepush');
      restartApp();
    }
    if (codepushError) {
      if (numberTry === 0) {
        setCodepushError(false);
        uiStore.hideLoading('downloading_codepush');
        setTimeout(() => {
          alertInfo(
            '',
            'There are an error was appeared, cannot install new update version.',
            false,
            () => {},
          );
        });
      } else {
        await handleCodepushUpdate(numberTry - 1);
      }
    }
  };

  const codePushStatusDidChange = (status: CodePush.SyncStatus) => {
    console.log('codePushStatusDidChange status', status);
    switch (status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        uiStore.changeCodepushState(false);
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        uiStore.changeCodepushState(true);
        setCodepushError(false);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        uiStore.changeCodepushState(true);
        setCodepushError(false);
        setUpToDate(true);
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        uiStore.changeCodepushState(true);
        setCodepushError(true);
        console.log('UNKNOWN_ERROR');
        break;
      default:
        break;
    }
  };

  const codePushDownloadDidProgress = (progress: DownloadProgress) => {
    console.log(
      'codePush download: ' +
        progress.receivedBytes +
        ' of ' +
        progress.totalBytes +
        ' received.',
    );
  };

  const sessionLoading = () => {
    return codePushStore.status;
  };

  const onUpToDate = () => {
    handleCodepushUpdate();
    // if (!isMandatory) {
    //   alertInfo(
    //     '',
    //     'New update available for the app. Do you want to restart the app to use the latest version?',
    //     true,
    //     handleCodepushUpdate,
    //   );
    // } else {
    //   alertInfo(
    //     '',
    //     'New update available for the app. Restart the application to experience.',
    //     false,
    //     handleCodepushUpdate,
    //   );
    // }
  };

  const restartApp = () => {
    CodePush.allowRestart();
    CodePush.restartApp(true);
  };

  useEffect(() => {
    async function setAppLanguage() {
      const deviceLanguage = getSystemLocale();
      const curLanguage = await getDataLocal(LANGUAGE_KEY);
      if (!curLanguage) {
        langStore.changeCurLanguage(deviceLanguage);
        await saveDataLocal(LANGUAGE_KEY, deviceLanguage);
      } else {
        langStore.changeCurLanguage(curLanguage);
      }
    }
    setAppLanguage();
    if (!__DEV__) {
      codePushStore.setListener(checkForUpdate);
    }
    codePushStore.start();
    subStore.init();
    // subStore.getAvailablePurchases();
    // initAdmob();
    requestUserPermission();
    const subscriberMess = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      alertInfo(
        remoteMessage.notification?.title || '',
        remoteMessage.notification?.body || '',
        false,
        () => {},
      );
    });

    return () => {
      subStore.removeListener();
      codePushStore.saveData();
      subscriberMess;
    };
  }, []);

  function navigateMealSelectionView(item: MealSelectionType) {
    if (item.type !== 'exercise') {
      uiStore.changeShowMealSelection(false);
      uiStore.curNavigation.navigate('MealSelection', {mealType: item});
    } else {
      uiStore.curNavigation.navigate('ExerciseSelection');
    }
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name="Auth"
            children={({route, navigation}) => (
              <AuthNavigation
                rootNavigation={navigation}
                uiStore={uiStore}
                userStore={userStore}
                subStore={subStore}
                langStore={langStore}
              />
            )}
          />
          <Stack.Screen
            name="BottomTabbar"
            children={({route, navigation}) => (
              <BottomTabbar
                rootNavigation={navigation}
                uiStore={uiStore}
                subStore={subStore}
                userStore={userStore}
                codePushStore={codePushStore}
                langStore={langStore}
                personStore={personStore}
              />
            )}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name="MealSelection"
            children={({route, navigation}) => (
              <MealsSelectionNavigation
                rootNavigation={navigation}
                rootRoute={route}
                uiStore={uiStore}
                langStore={langStore}
                subStore={subStore}
              />
            )}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name="ExerciseSelection"
            children={({navigation, route}) => (
              <ExerciseSelection
                navigation={navigation}
                uiStore={uiStore}
                langStore={langStore}
              />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {uiStore.isShowMealSelectionBtn && (
        <MealSelection
          selectedItem={(item: MealSelectionType) => {
            navigateMealSelectionView(item);
          }}
          langStore={langStore}
        />
      )}
      <UICommon store={uiStore} />
      <Toast ref={toast => toast && uiStore.setToast(toast)} />
    </View>
  );
});

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
