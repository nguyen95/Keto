import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import InputInformation from '../screens/information/input';
import TargetSelection from '../screens/information/target';
import StaticInformation from '../screens/information/static';
import AuthView from '../screens/auth';
import UIStore from '../shared/store/ui';
import UserStore from '../shared/store/user';
import LanguageStore from '../shared/store/language';
import SubStore from '../shared/store/sub';

const Stack = createStackNavigator();

type AuthNavigationProps = {
  rootNavigation: any;
  uiStore: UIStore;
  userStore: UserStore;
  subStore: SubStore;
  langStore: LanguageStore;
};

const AuthNavigation: React.FC<AuthNavigationProps> = ({
  rootNavigation,
  uiStore,
  userStore,
  subStore,
  langStore,
}: AuthNavigationProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Login"
        children={({navigation}) => (
          <AuthView
            navigation={navigation}
            rootNavigation={rootNavigation}
            userStore={userStore}
            uiStore={uiStore}
            subStore={subStore}
            langStore={langStore}
          />
        )}
      />
      <Stack.Screen
        name="InputInformation"
        children={({navigation}) => (
          <InputInformation
            navigation={navigation}
            uiStore={uiStore}
            langStore={langStore}
          />
        )}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="TargetSelection"
        children={({navigation}) => (
          <TargetSelection
            navigation={navigation}
            uiStore={uiStore}
            langStore={langStore}
          />
        )}
      />
      <Stack.Screen
        name="StaticInformation"
        children={({navigation}) => (
          <StaticInformation
            rootNavigation={rootNavigation}
            navigation={navigation}
            uiStore={uiStore}
            langStore={langStore}
          />
        )}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
