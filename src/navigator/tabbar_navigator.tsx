import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigationState,
  PartialState,
  Route,
} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image} from 'react-native';
import LanguageStore from '../shared/store/language';
import CodePushStore from '../shared/store/codepush';
import SubStore from '../shared/store/sub';
import UIStore from '../shared/store/ui';
import UserStore from '../shared/store/user';
import AppStyle from '../shared/ui/styles/app.style';
import {IC_HEART, IC_HOME, IC_PERSON} from '../utils/icons';
import HomeNavigation from './home_navigation';
import MealsNavigation from './meals_navigation';
import PersonNavigation from './person_navigation';
import PersonStore from '../screens/person/store';

type BottomTabbarProps = {
  rootNavigation: any;
  uiStore: UIStore;
  subStore: SubStore;
  codePushStore: CodePushStore;
  userStore: UserStore;
  langStore: LanguageStore;
  personStore: PersonStore;
};
const Tab = createBottomTabNavigator();

const BottomTabbar: React.FC<BottomTabbarProps> = ({
  rootNavigation,
  uiStore,
  subStore,
  codePushStore,
  userStore,
  langStore,
  personStore,
}: BottomTabbarProps) => {
  useEffect(() => {
    uiStore.setCurNav(rootNavigation);
    return;
  }, []);

  function getVisibleBottomBar(
    route: Partial<Route<string>> & {
      state?: PartialState<NavigationState>;
    },
    mainRouteName: string,
  ) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? '';
    if (routeName !== mainRouteName && routeName !== '') {
      return false;
    }
    return true;
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: AppStyle.Color.Main,
        inactiveTintColor: AppStyle.Color.TabBarGray,
        style: {
          backgroundColor: AppStyle.Color.Background,
        },
      }}>
      <Tab.Screen
        name="Home"
        children={({navigation}) => (
          <HomeNavigation
            rootNavigation={rootNavigation}
            uiStore={uiStore}
            langStore={langStore}
            subStore={subStore}
            personStore={personStore}
          />
        )}
        options={({route}) => ({
          tabBarIcon: ({color}) => (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                tintColor: color,
              }}
              source={IC_HOME}
            />
          ),
          tabBarVisible: (route => {
            return getVisibleBottomBar(route, 'Home');
          })(route),
        })}
      />
      <Tab.Screen
        name="Meal"
        children={({navigation}) => (
          <MealsNavigation
            rootNavigation={rootNavigation}
            uiStore={uiStore}
            langStore={langStore}
            subStore={subStore}
          />
        )}
        options={({route}) => ({
          tabBarIcon: ({color}) => (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                tintColor: color,
              }}
              source={IC_HEART}
            />
          ),
          tabBarVisible: (route => {
            return getVisibleBottomBar(route, 'Meal');
          })(route),
        })}
      />
      <Tab.Screen
        name="Person"
        children={({navigation}) => (
          <PersonNavigation
            rootNavigation={rootNavigation}
            uiStore={uiStore}
            userStore={userStore}
            langStore={langStore}
            subStore={subStore}
            personStore={personStore}
          />
        )}
        options={({route}) => ({
          tabBarIcon: ({color}) => (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                tintColor: color,
              }}
              source={IC_PERSON}
            />
          ),
          tabBarVisible: (route => {
            return getVisibleBottomBar(route, 'Person');
          })(route),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabbar;
