import React, {useEffect, useState} from 'react';
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Svg, {Circle} from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {observer} from 'mobx-react';
import UIStore from '../../shared/store/ui';
import LanguageStore from '../../shared/store/language';
import WeightChart from '../../shared/ui/components/weight_chart';
import TipOfDay from '../../shared/ui/containers/tip_of_day';
import AppStyle from '../../shared/ui/styles/app.style';
import {IC_GLASS, IC_GLASS_NONE} from '../../utils/icons';
import HomeStore from './store';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import MealList from '../../shared/ui/private/meal_list';
import InputPopup from '../../shared/ui/components/input_popup';
import {useFocusEffect} from '@react-navigation/native';
import {MealType} from '../../shared/objects/meal';
import {DataHome} from '../../shared/objects/DataHome';
import {ExerciseType} from '../../shared/objects/exercise';
import ExerciseList from '../../shared/ui/private/exercise_list';
import {NOTIFY_EATING_ID, NOTIFY_EATING_ID_ANDROID} from '../../utils/consts';
import PersonStore from '../person/store';
import {toJS} from 'mobx';
import SubStore from '../../shared/store/sub';
import SubscriptionScreen from '../subscription/view';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type HomeProps = {
  rootNavigation: any;
  navigation: any;
  uiStore: UIStore;
  homeStore: HomeStore;
  langStore: LanguageStore;
  personStore: PersonStore;
  subStore: SubStore;
};

const HomeScreen: React.FC<HomeProps> = observer(
  ({
    rootNavigation,
    navigation,
    uiStore,
    homeStore,
    langStore,
    personStore,
    subStore,
  }: HomeProps) => {
    const {currentLanguage, currentTimelineMenu, currentTip} = langStore;
    const [scroll, setstate] = useState(new Animated.Value(0));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showWeightPopup, setShowWeightPopup] = useState(false);
    const [subModalVisible, setSubModalVisible] = useState(false);

    const backAction = () => {
      return true;
    };

    function setupEatingNotification() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = today.getDate();
      const breakfastTime = new Date(year, month, day, 6, 45, 0);

      if (Platform.OS === 'android') {
        PushNotification.getScheduledLocalNotifications(notifications => {
          const idx = notifications.findIndex(
            e => e.id === NOTIFY_EATING_ID_ANDROID,
          );
          if (idx === -1) {
            PushNotification.localNotificationSchedule({
              channelId: NOTIFY_EATING_ID,
              bigText: currentLanguage.BMR.eating.notificationSub,
              color: AppStyle.Color.Main,
              vibration: 300,
              ongoing: false,
              ignoreInForeground: true,
              onlyAlertOnce: true,
              id: NOTIFY_EATING_ID_ANDROID,
              title: currentLanguage.BMR.eating.notificationTitle,
              message: currentLanguage.BMR.eating.notificationSub,
              playSound: false,
              repeatType: 'day',
              date: breakfastTime,
            });
          }
        });
      } else {
        PushNotificationIOS.getPendingNotificationRequests(requests => {
          const idx = requests.findIndex(
            e => e.userInfo?.id === NOTIFY_EATING_ID,
          );
          if (idx === -1) {
            PushNotificationIOS.scheduleLocalNotification({
              userInfo: {id: NOTIFY_EATING_ID},
              alertTitle: currentLanguage.BMR.eating.notificationTitle,
              alertBody: currentLanguage.BMR.eating.notificationSub,
              fireDate: breakfastTime.toISOString(),
              repeatInterval: 'day',
            });
          }
        });
      }
    }

    useEffect(() => {
      async function getAvailablePurchases() {
        uiStore.showLoading('sub');
        await subStore.getAvailablePurchases();
        uiStore.hideLoading('sub');
        if (!subStore.isVip) {
          setSubModalVisible(true);
        }
      }
      getAvailablePurchases();
      const unsubscribe = navigation.addListener('focus', () => {
        if (subStore.isVip) return;
        const curCount = uiStore.tabClickedCount;
        uiStore.changeNumTabClicked(curCount + 1);
      });
      homeStore.listenData();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      const unsubscribeIn = navigation.addListener('focus', () => {
        uiStore.changeShowMealSelection(true);
      });
      const unsubscribeOut = navigation.addListener('blur', () => {
        uiStore.changeShowMealSelection(false);
      });
      setupEatingNotification();
      return () => {
        unsubscribe;
        backHandler.remove();
        unsubscribeIn;
        unsubscribeOut;
      };
    }, []);

    const {
      data,
      dataHealthDay,
      dataAll,
      waterNum,
      setWaterNum,
      currentDate,
      setCurrentDate,
      currentWeight,
      updateCurrentWeight,
      suggestWeight,
      dataWeight,
      dataWeightX,
      dataWeightY,
      dataMeal,
      addMealItem,
      addExItem,
      removeMealItem,
      removeExItem,
    } = homeStore;

    useFocusEffect(
      React.useCallback(() => {
        setCurrentDate(new Date());
        return () => {};
      }, []),
    );

    let now = new Date();
    now.setHours(0, 0, 0, 0);

    const onDateChange = selectedDate => {
      const currentDateC = selectedDate || currentDate;
      setShowDatePicker(false);
      setCurrentDate(currentDateC);
    };

    const onPreviousDate = () => {
      let d = new Date(currentDate);
      d.setDate(currentDate.getDate() - 1);
      setCurrentDate(d);
    };

    const onNextDate = () => {
      let d = new Date(currentDate);
      d.setDate(currentDate.getDate() + 1);
      setCurrentDate(d);
    };

    const onPressWeight = () => {
      navigation.navigate('WeightChartScreen');
    };
    const onPressWeightUpdate = () => {
      setShowWeightPopup(true);
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

    function onClickMealItem(item: MealType) {
      if (currentDate.getTime() === now.getTime()) {
        navigation.navigate('MealDetail', {
          meal_data: item,
          onClickMealAddItem,
          isCreateNewMeal: false,
        });
      }
    }

    const onClickMealAddItem = async (item: MealType | ExerciseType) => {
      addMealItem(item as MealType);
    };

    const onClickExAddItem = async (item: MealType | ExerciseType) => {
      addExItem(item as ExerciseType);
    };

    const onClickMealRemoveItem = async (item: MealType | ExerciseType) => {
      removeMealItem(item as MealType);
    };

    const onClickExRemoveItem = async (item: MealType | ExerciseType) => {
      removeExItem(item as ExerciseType);
    };

    const renderItemCalo = (item: DataHome) => {
      return (
        <View style={styles.itemCaloContainer}>
          <View style={styles.itemCaloHeader}>
            <Text style={styles.itemCaloTitle}>{item.name}</Text>
            <Text style={styles.itemCaloInfo}>{item.total} calo</Text>
          </View>
          {item.name !== currentLanguage.exercise.title ? (
            <MealList
              data={item.data}
              canAdd={false}
              canRemove={true}
              callbackClickItem={(item: MealType) => {
                onClickMealItem(item);
              }}
              callbackClickAddItem={onClickMealAddItem}
              callbackClickRemoveItem={onClickMealRemoveItem}
              langStore={langStore}
            />
          ) : (
            <ExerciseList
              data={item.data}
              canAdd={false}
              canRemove={true}
              callbackClickAddItem={onClickExAddItem}
              callbackClickRemoveItem={onClickExRemoveItem}
              langStore={langStore}
            />
          )}
        </View>
      );
    };

    const customRating = () => {
      let data = [1, 2, 3, 4, 5, 6, 7, 8];
      return (
        <View
          style={{
            width: AppStyle.Screen.FullWidth - 96,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {data.map((val, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (index + 1 === waterNum) {
                  setWaterNum(index);
                } else {
                  setWaterNum(index + 1);
                }
              }}>
              <Image
                source={index < waterNum ? IC_GLASS : IC_GLASS_NONE}
                style={{
                  width: (AppStyle.Screen.FullWidth - 96) / 8 - 4,
                  height: (AppStyle.Screen.FullWidth - 96) / 8 - 4,
                  marginHorizontal: 2,
                  tintColor:
                    index < waterNum
                      ? AppStyle.Color.Main
                      : AppStyle.Color.TabBarGray,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    let waterMl = waterNum * 250;
    let caloTarget = data.target.calo < 10000 ? data.target.calo : 10000;
    let targetMaterial = data.target.materials
      ? data.target.materials
      : dataHealthDay.materials;
    let caloEaten = dataHealthDay.eaten - dataHealthDay.burned;
    let caloNeed = caloTarget - caloEaten;
    let statusBarHeight = Platform.OS === 'ios' ? getStatusBarHeight() : 0;

    if (homeStore.data) {
      uiStore.hideLoading('LoadHome');
      return (
        <View style={{flex: 1}}>
          <ScrollView style={styles.container} overScrollMode="never">
            <View>
              <AnimatedSvg height={320 + statusBarHeight}>
                <AnimatedCircle
                  cx={AppStyle.Screen.FullWidth / 2}
                  cy={-AppStyle.Screen.FullHeight + 320 + statusBarHeight}
                  r={AppStyle.Screen.FullHeight}
                  fill={AppStyle.Color.Main}
                />
              </AnimatedSvg>
              <Animated.View
                style={[
                  styles.foreground,
                  {
                    opacity: 1,
                    height: 280 + statusBarHeight,
                    paddingTop: statusBarHeight,
                  },
                ]}>
                <View style={styles.calendarInfo}>
                  {now.getTime() == currentDate.getTime() ? (
                    <Text style={styles.calendarText}>
                      {currentLanguage.BMR.today}
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentDate(now);
                      }}>
                      <Text style={styles.calendarText}>
                        {currentLanguage.custom.backToNow}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.calendar}>
                    <TouchableOpacity
                      style={styles.calendarBtn}
                      onPress={onPreviousDate}>
                      <Icon name="arrow-left" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calendarBtn}
                      onPress={() => setShowDatePicker(true)}>
                      <Icon name="calendar" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.calendarDate}>
                      {currentDate.getDate() +
                        ' - ' +
                        (currentDate.getMonth() + 1)}
                    </Text>
                    <TouchableOpacity
                      style={styles.calendarBtn}
                      onPress={onNextDate}>
                      <Icon name="arrow-right" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.caloInfo}>
                  <View style={styles.caloRow}>
                    <View style={styles.caloNeed}>
                      <Text
                        style={styles.caloTextNormal}
                        numberOfLines={1}
                        lineBreakMode="tail">
                        {dataHealthDay.eaten
                          ? dataHealthDay.eaten.toFixed(0)
                          : 0}
                      </Text>
                      <Text style={styles.caloTextSmall}>
                        {currentLanguage.calo.caloEaten}
                      </Text>
                    </View>
                    <View style={styles.caloNeed}>
                      <Progress.Circle
                        progress={caloTarget > 0 ? caloEaten / caloTarget : 0}
                        size={AppStyle.Screen.FullWidth / 3}
                        borderWidth={0}
                        // borderColor={'#FFFFFF'}
                        color={'#FFFFFF'}
                        unfilledColor={'#FFFFFF20'}
                      />
                      <View style={[styles.caloNeed, styles.caloCircle]}>
                        <Text
                          style={styles.caloTextBig}
                          numberOfLines={1}
                          lineBreakMode="tail">
                          {caloNeed.toFixed(0)}
                        </Text>
                        <Text style={styles.caloTextSmall}>
                          {currentLanguage.calo.kcalRemaining}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.caloNeed}>
                      <Text
                        style={styles.caloTextNormal}
                        numberOfLines={1}
                        lineBreakMode="tail">
                        {dataHealthDay.burned ? dataHealthDay.burned : 0}
                      </Text>
                      <Text style={styles.caloTextSmall}>
                        {currentLanguage.calo.caloBurned}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.caloRow}>
                    <View style={styles.caloNeed}>
                      <Text style={styles.caloTextSmall}>
                        {currentLanguage.nutritions.carbs}
                      </Text>
                      <Progress.Bar
                        style={{marginVertical: 8}}
                        progress={
                          dataHealthDay.materials.carbs.target > 0
                            ? dataHealthDay.materials.carbs.eaten /
                              targetMaterial.carbs.target
                            : 0
                        }
                        width={AppStyle.Screen.FullWidth / 3 - 36}
                        height={4}
                        borderWidth={0}
                        color={'#FFFFFF'}
                        unfilledColor={'#FFFFFF20'}
                      />
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={
                          styles.caloTextSmall
                        }>{`${dataHealthDay.materials.carbs.eaten.toFixed(
                        1,
                      )} / ${targetMaterial.carbs.target.toFixed(1)}`}</Text>
                    </View>
                    <View style={styles.caloNeed}>
                      <Text style={styles.caloTextSmall}>
                        {currentLanguage.nutritions.protein}
                      </Text>
                      <Progress.Bar
                        style={{marginVertical: 8}}
                        progress={
                          dataHealthDay.materials.protein.target > 0
                            ? dataHealthDay.materials.protein.eaten /
                              targetMaterial.protein.target
                            : 0
                        }
                        width={AppStyle.Screen.FullWidth / 3 - 36}
                        height={4}
                        borderWidth={0}
                        color={'#FFFFFF'}
                        unfilledColor={'#FFFFFF20'}
                      />
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={
                          styles.caloTextSmall
                        }>{`${dataHealthDay.materials.protein.eaten.toFixed(
                        1,
                      )} / ${targetMaterial.protein.target.toFixed(1)}`}</Text>
                    </View>
                    <View style={styles.caloNeed}>
                      <Text style={styles.caloTextSmall}>
                        {currentLanguage.nutritions.fat}
                      </Text>
                      <Progress.Bar
                        style={{marginVertical: 8}}
                        progress={
                          dataHealthDay.materials.fat.target > 0
                            ? dataHealthDay.materials.fat.eaten /
                              targetMaterial.fat.target
                            : 0
                        }
                        width={AppStyle.Screen.FullWidth / 3 - 36}
                        height={4}
                        borderWidth={0}
                        color={'#FFFFFF'}
                        unfilledColor={'#FFFFFF20'}
                      />
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={
                          styles.caloTextSmall
                        }>{`${dataHealthDay.materials.fat.eaten.toFixed(
                        1,
                      )} / ${targetMaterial.fat.target.toFixed(1)}`}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
            <View>
              <Text style={styles.textWater}>
                {`${currentLanguage.BMR.drinkWater.needToDrink}   ${waterMl} ml`}
              </Text>
              <View style={styles.waterContainer}>{customRating()}</View>
              {!dataMeal || dataMeal.length === 0 ? (
                <TipOfDay langStore={langStore} />
              ) : (
                <View style={{flex: 1, marginTop: 16}}>
                  <FlatList
                    data={dataAll}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => renderItemCalo(item)}
                  />
                </View>
              )}
              {dataWeight.length > 0 && (
                <WeightChart
                  info={
                    data.target.weight
                      ? `${data.target.weight} kg`
                      : suggestWeight + ' kg'
                  }
                  action={onPressWeight}
                  actionPlus={onPressWeightUpdate}
                  actionPlan={onPressSuggestionMenu}
                  chartHeight={150}
                  data={dataWeight}
                  dataY={dataWeightY}
                  dataX={dataWeightX}
                  langStore={langStore}
                />
              )}
            </View>
            <View style={{height: 80}} />
          </ScrollView>
          {showDatePicker && (
            <DateTimePickerModal
              isVisible={showDatePicker}
              date={currentDate}
              mode="date"
              onConfirm={onDateChange}
              onCancel={date => setShowDatePicker(false)}
            />
          )}
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
          {!subStore.isVip && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={subModalVisible}
              onRequestClose={() => {
                setSubModalVisible(!subModalVisible);
              }}>
              <SubscriptionScreen
                subStore={subStore}
                uiStore={uiStore}
                langStore={langStore}
                navigation={navigation}
                route={null}
                isModalShow={true}
                dismissView={() => setSubModalVisible(false)}
              />
            </Modal>
          )}
        </View>
      );
    } else {
      uiStore.showLoading('LoadHome');
      return <ScrollView style={styles.container}></ScrollView>;
    }
  },
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  foreground: {
    position: 'absolute',
    top: 0,
    width: AppStyle.Screen.FullWidth,
    height: 280,
    backgroundColor: AppStyle.Color.Main,
  },
  calendarInfo: {
    width: AppStyle.Screen.FullWidth,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppStyle.Color.White,
  },
  calendar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarBtn: {
    paddingHorizontal: 16,
  },
  calendarDate: {
    marginRight: 12,
    fontSize: 14,
    color: AppStyle.Color.White,
  },
  caloInfo: {
    padding: 8,
  },
  caloRow: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloNeed: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloCircle: {
    position: 'absolute',
    width: AppStyle.Screen.FullWidth / 3,
    height: AppStyle.Screen.FullWidth / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloTextBig: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppStyle.Color.White,
  },
  caloTextNormal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppStyle.Color.White,
  },
  caloTextSmall: {
    fontSize: 12,
    marginTop: 2,
    color: AppStyle.Color.White,
  },
  body: {
    flexGrow: 1,
    paddingTop: 24,
  },
  textWater: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  waterContainer: {
    padding: 24,
    margin: 24,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: AppStyle.Color.White,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  rating: {
    width: AppStyle.Screen.FullWidth - 96,
  },
  itemCaloContainer: {
    width: AppStyle.Screen.FullWidth - 48,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  itemCaloHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemCaloTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCaloInfo: {
    fontSize: 14,
  },
});
