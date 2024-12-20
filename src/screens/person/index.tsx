import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {getDataLocal, saveDataLocal} from '../../services/storage';
import {
  NOTIFY_WATER_ID,
  NOTIFY_KEY,
  ARRAY_WATER_NOTI_ID,
  NOTIFI_CHANEL_ID,
} from '../../utils/consts';
import LanguageStore from '../../shared/store/language';
import UIStore from '../../shared/store/ui';
import UserStore from '../../shared/store/user';
import InputPopup from '../../shared/ui/components/input_popup';
import WeightChart from '../../shared/ui/components/weight_chart';
import BaseHeader from '../../shared/ui/containers/base_header';
import AppStyle from '../../shared/ui/styles/app.style';
import {commonStyles} from '../../shared/ui/styles/common.style';
import {IC_GET_PREMIUM, IC_OLD, IC_PREMIUM} from '../../utils/icons';
import PersonStore from './store';
import {alertInfo} from '../../utils/functions';
import {toJS} from 'mobx';
import SubStore from '../../shared/store/sub';

type PersonScreenProps = {
  rootNavigation: any;
  navigation: any;
  uiStore: UIStore;
  personStore: PersonStore;
  userStore: UserStore;
  langStore: LanguageStore;
  subStore: SubStore;
};

const PersonScreen: React.FC<PersonScreenProps> = observer(
  ({
    rootNavigation,
    navigation,
    uiStore,
    personStore,
    userStore,
    langStore,
    subStore,
  }: PersonScreenProps) => {
    const {currentLanguage, currentTimelineMenu} = langStore;
    const [noti, setNoti] = useState(false);
    const [showWeightPopup, setShowWeightPopup] = useState(false);

    const initNoti = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      const d0 = new Date(year, month, day, 7, 0, 0);
      const d1 = new Date(year, month, day, 9, 0, 0);
      const d2 = new Date(year, month, day, 11, 0, 0);
      const d3 = new Date(year, month, day, 13, 30, 0);
      const d4 = new Date(year, month, day, 13, 30, 0);
      const d5 = new Date(year, month, day, 15, 30, 0);
      const d6 = new Date(year, month, day, 17, 30, 0);
      const d7 = new Date(year, month, day, 7, 0, 0);
      const arrIdNotiTime = [d0, d1, d2, d3, d4, d5, d6, d7];
      ARRAY_WATER_NOTI_ID.forEach((id, index) => {
        if (Platform.OS === 'android') {
          PushNotification.localNotificationSchedule({
            channelId: NOTIFI_CHANEL_ID,
            bigText: currentLanguage.BMR.drinkWater.notificationSub,
            color: AppStyle.Color.Main,
            id: index,
            title: currentLanguage.BMR.drinkWater.notificationTitle,
            message: currentLanguage.BMR.drinkWater.notificationSub,
            playSound: false,
            repeatType: 'day',
            date: arrIdNotiTime[index],
          });
        } else {
          PushNotificationIOS.scheduleLocalNotification({
            userInfo: {id: NOTIFY_WATER_ID},
            alertTitle: currentLanguage.BMR.drinkWater.notificationTitle,
            alertBody: currentLanguage.BMR.drinkWater.notificationSub,
            fireDate: arrIdNotiTime[index].toISOString(),
            repeatInterval: 'day',
          });
        }
      });
    };

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        if (subStore.isVip) return;
        const curCount = uiStore.tabClickedCount;
        uiStore.changeNumTabClicked(curCount + 1);
      });
      async function getCurIsPushDisabled() {
        const enableNotify = await getDataLocal(NOTIFY_KEY);
        if (enableNotify && enableNotify === '1') {
          initNoti();
          setNoti(true);
        } else {
          PushNotification.cancelAllLocalNotifications();
          setNoti(false);
        }
      }
      getCurIsPushDisabled();
      personStore.listenData();
      const unsubscribeIn = navigation.addListener('focus', () => {
        uiStore.changeShowMealSelection(true);
      });
      const unsubscribeOut = navigation.addListener('blur', () => {
        uiStore.changeShowMealSelection(false);
      });
      // if (Platform.OS === 'android') {
      //   PushNotification.getScheduledLocalNotifications((notifications) => {
      //     console.log('xxxxxx request', notifications);
      //   });
      // } else {
      //   PushNotificationIOS.getPendingNotificationRequests((requests) => {
      //     console.log('xxxxxx request', requests);
      //   });
      // }

      return () => {
        unsubscribe;
        unsubscribeIn;
        unsubscribeOut;
      };
    }, []);

    const {
      data,
      waterNum,
      setWaterNum,
      suggestWeight,
      dataWeight,
      dataWeightX,
      dataWeightY,
      BMI,
      currentWeight,
      updateCurrentWeight,
      getLipid,
      dateUpdateWeight,
      messageWeight,
    } = personStore;

    function navigateToOtherScreen(screen: string) {
      navigation.navigate(screen);
    }

    const onOpenSetting = () => {
      navigateToOtherScreen('SettingScreen');
    };
    const onPressBMI = () => {
      navigateToOtherScreen('ChartScreen');
    };
    const onPressLifespan = () => {
      navigateToOtherScreen('LifeCheck');
    };
    const onPressWater = () => {
      navigateToOtherScreen('ChartScreen');
    };
    const onPressWeight = () => {
      navigateToOtherScreen('WeightChartScreen');
    };
    const onPressWeightUpdate = () => {
      setShowWeightPopup(true);
    };
    const onWaterPlus = () => {
      waterNum < 8 && setWaterNum(waterNum + 1);
    };
    const onWaterMinus = () => {
      waterNum > 0 && setWaterNum(waterNum - 1);
    };
    const changeNotiStt = () => {
      if (noti) {
        if (Platform.OS === 'android') {
          ARRAY_WATER_NOTI_ID.forEach((noti_id, idx) => {
            PushNotification.cancelLocalNotifications({id: `${idx}`});
          });
        } else {
          PushNotificationIOS.cancelLocalNotifications({id: NOTIFY_WATER_ID});
        }
        saveDataLocal(NOTIFY_KEY, '0');
        setNoti(false);
      } else {
        if (Platform.OS === 'ios') {
          PushNotification.checkPermissions((result: any) => {
            if (result.authorizationStatus !== 2) {
              alertInfo(
                '',
                currentLanguage.BMR.drinkWater.requirePermissions,
                true,
                () => {
                  Linking.openSettings();
                },
              );
            } else {
              initNoti();
              saveDataLocal(NOTIFY_KEY, '1');
              setNoti(true);
            }
          });
        } else {
          initNoti();
          saveDataLocal(NOTIFY_KEY, '1');
          setNoti(true);
        }
      }
    };

    function goToSuggestionMenu() {
      const curGoal = personStore.data.target.status;
      const data = toJS(currentTimelineMenu).filter(
        (e: any) => e.key === curGoal,
      );
      if (data && data.length > 0) {
        navigation.navigate('SuggestionMenu', {schedule: data[0].samples});
      }
    }

    const onPressSuggestionMenu = () => {
      if (subStore.isVip) {
        goToSuggestionMenu();
      } else {
        navigation.navigate('Subscription', {
          actionAfterVip: goToSuggestionMenu,
        });
      }
    };

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={
            <View style={styles.iconLogoContainer}>
              {subStore.isVip ? (
                <Image source={IC_PREMIUM} style={styles.iconLogo} />
              ) : (
                <Image source={IC_GET_PREMIUM} style={styles.iconPremium} />
              )}
            </View>
          }
          rightElement={
            // null
            <View style={styles.iconLogoContainer}>
              {userStore.user &&
              userStore.user.photoURL &&
              userStore.user.photoURL !== '' ? (
                <Image
                  source={{uri: userStore.user.photoURL}}
                  style={styles.iconLogo}
                />
              ) : (
                <Icon name="cog" size={32} color="white" />
              )}
            </View>
          }
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.personal}
            </Text>
          }
          rightAction={onOpenSetting}
          leftAction={!subStore.isVip ? onPressSuggestionMenu : () => {}}
        />
        <ScrollView contentContainerStyle={styles.containerScroll}>
          <Text style={styles.itemTitle}>{currentLanguage.BMR.BMI}</Text>
          <TouchableOpacity style={styles.itemPerson} onPress={onPressBMI}>
            <View style={styles.itemRowLeft}>
              <View style={styles.itemChild}>
                <Text style={styles.itemTextBigRed}>{BMI.toFixed(1)}</Text>
                <Text style={styles.itemTextSmallSub}>{'BMI'}</Text>
              </View>
            </View>
            <View style={styles.itemRow}>
              <View style={styles.itemChildLeft}>
                <Text style={styles.itemTextSmall}>
                  {getLipid().toFixed(1)}%
                </Text>
                <Text style={styles.itemTextSmallSub}>
                  {currentLanguage.custom.lipid}
                </Text>
              </View>
              <View style={styles.itemChildRight}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="calendar"
                    size={16}
                    color={AppStyle.Color.TextGray}
                    style={{marginRight: 8}}
                  />
                  <Text style={styles.itemTextSmall}>{dateUpdateWeight}</Text>
                </View>
                <Text
                  style={[
                    styles.itemTextSmallSub,
                    {color: AppStyle.Color.Orange, textAlign: 'right'},
                  ]}>
                  {currentLanguage.BMR.dateUpdateWeight}
                </Text>
              </View>
            </View>
            <View style={styles.itemRow}>
              <View style={styles.itemChildLeft}>
                <Text style={styles.itemTextSmall}>
                  {data.height.toFixed(1)} cm
                </Text>
                <Text style={styles.itemTextSmallSub}>
                  {currentLanguage.BMR.height}
                </Text>
              </View>
              <View style={styles.itemChildRight}>
                <Text style={styles.itemTextSmall}>
                  {currentWeight.toFixed(1)} kg
                </Text>
                <Text style={styles.itemTextSmallSub}>{messageWeight}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.itemTitle}>
            {currentLanguage.custom.estimatedLifespan}
          </Text>
          <TouchableOpacity style={styles.itemPerson} onPress={onPressLifespan}>
            <View style={styles.itemRowCenter}>
              <View style={styles.itemChild}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={IC_OLD}
                    style={{width: 48, height: 48, marginRight: 16}}
                    resizeMode="contain"
                  />
                  <Text style={styles.itemTextMaxRed}>
                    {data.lifeSpan ? data.lifeSpan : '?'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.itemTextSmallSub,
                    {
                      maxWidth: AppStyle.Screen.FullWidth - 96,
                      textAlign: 'center',
                    },
                  ]}>
                  {data.lifeSpan
                    ? currentLanguage.custom.estimatedLifespan
                    : currentLanguage.custom.estimatedLifespanSub}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.itemTitle}>
            {currentLanguage.BMR.drinkWater.title}
          </Text>
          <TouchableOpacity style={styles.itemPerson} onPress={onPressWater}>
            <View style={styles.itemRow}>
              <View style={styles.itemChild}>
                <Text style={styles.itemTextBigRed}>
                  {1950}
                  <Text style={styles.itemTextSmallRed}>
                    {' ' + currentLanguage.BMR.drinkWater.mlDay}
                  </Text>
                </Text>
                <Text style={styles.itemTextSmallSubLight}>
                  {currentLanguage.BMR.drinkWater.dailyGoal}
                </Text>
                <TouchableOpacity style={styles.notify} onPress={changeNotiStt}>
                  <Icon
                    name={noti ? 'bell' : 'bell-slash'}
                    size={20}
                    color={AppStyle.Color.Orange}
                  />
                  <Text style={styles.notifyText}>
                    {noti
                      ? currentLanguage.BMR.drinkWater.weWillNoti
                      : currentLanguage.BMR.drinkWater.enableNoti}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWater}>
                <View style={styles.itemWaterBtnContainer}>
                  <TouchableOpacity
                    style={styles.itemWaterBtn}
                    onPress={onWaterPlus}>
                    <Text style={styles.itemWaterBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.itemWaterBtn}
                    onPress={onWaterMinus}>
                    <Text style={styles.itemWaterBtnText}>-</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.itemWaterChartContainer}>
                  <View style={styles.itemWaterChartContainerNoneShadow}>
                    <View
                      style={[styles.water, {bottom: waterNum * 20 - 160}]}
                    />
                    <Text style={styles.waterPercent}>
                      {(waterNum * 100) / 8}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {dataWeight.length > 0 && (
            <WeightChart
              chartHeight={150}
              data={dataWeight}
              dataY={dataWeightY}
              dataX={dataWeightX}
              info={
                data.target.weight
                  ? `${data.target.weight} kg`
                  : suggestWeight + ' kg'
              }
              action={onPressWeight}
              actionPlus={onPressWeightUpdate}
              actionPlan={onPressSuggestionMenu}
              langStore={langStore}
            />
          )}
          {/* <TouchableOpacity style={styles.signOutContainer} onPress={signOut}>
            <Text style={styles.signOut}>
              {currentLanguage.setting.signOut}
            </Text>
            <Icon name="power-off" size={20} color="red" />
          </TouchableOpacity> */}
        </ScrollView>
        {showWeightPopup && (
          <InputPopup
            title={currentLanguage.BMR.weightStat.popupTitle}
            btnOk={currentLanguage.BMR.weightStat.popupBtnTitle}
            btnCancel={currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
            value={currentWeight + ''}
            actionCancel={() => {
              setShowWeightPopup(false);
            }}
            actionOk={val => {
              updateCurrentWeight(val);
            }}
            langStore={langStore}
          />
        )}
      </View>
    );
  },
);

export default PersonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  iconLogoContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  iconPremium: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: AppStyle.Color.White,
    paddingBottom: 80,
    // alignItems: 'center',
  },
  itemPerson: {
    backgroundColor: AppStyle.Color.White,
    width: AppStyle.Screen.FullWidth - 48,
    marginLeft: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 24,
    marginTop: 24,
  },
  itemRow: {
    width: AppStyle.Screen.FullWidth - 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  itemRowCenter: {
    width: AppStyle.Screen.FullWidth - 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 32,
  },
  itemRowLeft: {
    width: AppStyle.Screen.FullWidth - 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingBottom: 4,
    paddingTop: 16,
  },
  itemChild: {
    alignItems: 'center',
  },
  itemChildLeft: {
    alignItems: 'flex-start',
  },
  itemChildRight: {
    alignItems: 'flex-end',
  },
  itemTextBigRed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  itemTextMaxRed: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red',
  },
  itemTextSmall: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
  },
  itemTextSmallRed: {
    fontSize: 14,
    color: 'red',
  },
  itemTextSmallSub: {
    fontSize: 14,
    fontWeight: 'bold',
    color: AppStyle.Color.TextGray,
    marginTop: 8,
    maxWidth: AppStyle.Screen.FullWidth / 2 - 48,
  },
  itemTextSmallSubLight: {
    fontSize: 12,
    marginTop: 4,
    color: 'black',
    textAlign: 'center',
    maxWidth: AppStyle.Screen.FullWidth / 2 - 48,
  },
  notify: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  notifyText: {
    marginLeft: 12,
    maxWidth: AppStyle.Screen.FullWidth / 3,
    fontSize: 12,
    color: AppStyle.Color.Orange,
  },
  itemWater: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemWaterBtnContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemWaterBtn: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyle.Color.White,
    height: 28,
    width: 28,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  itemWaterBtnText: {
    color: AppStyle.Color.Main,
    fontSize: 24,
    textAlign: 'center',
  },
  itemWaterChartContainer: {
    alignItems: 'center',
    width: 50,
    height: 160,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 25,
    margin: 8,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  itemWaterChartContainerNoneShadow: {
    alignItems: 'center',
    width: 50,
    height: 160,
    backgroundColor: AppStyle.Color.White,
    borderRadius: 25,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  water: {
    width: 50,
    height: 160,
    position: 'absolute',
    backgroundColor: AppStyle.Color.Main,
    bottom: -100,
  },
  waterPercent: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: AppStyle.Color.White,
  },
  signOutContainer: {
    backgroundColor: AppStyle.Color.White,
    width: AppStyle.Screen.FullWidth,
    padding: 24,
    paddingBottom: 70,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  signOut: {
    fontSize: 14,
    marginRight: 24,
    fontWeight: 'bold',
  },
  suggestMenuBtn: {
    height: 40,
    width: AppStyle.Screen.FullWidth / 1.5,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: AppStyle.Color.Orange,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  suggestMenuBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppStyle.Color.White,
  },
});
