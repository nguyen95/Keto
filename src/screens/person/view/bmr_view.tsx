import React, {useCallback, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  BackHandler,
} from 'react-native';
import LanguageStore from '../../../shared/store/language';
import UserStore from '../../../shared/store/user';
import BaseHeader from '../../../shared/ui/containers/base_header';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CaloChart from '../../../shared/ui/components/calo_chart';
import {saveDataLocal} from '../../../services/storage';
import {
  ENTERED_INFOMATION,
  ENTERED_INFORMATION_KEY,
} from '../../../utils/consts';
import PersonStore from '../store';
import {observer} from 'mobx-react';
import InputPopup from '../../../shared/ui/components/input_popup';
import {staticBRM} from '../../../services/static_calo';
import {IC_BACK} from '../../../utils/icons';

type BmrProps = {
  navigation: any;
  personStore: PersonStore;
  langStore: LanguageStore;
};

const BmrUpdateScreen: React.FC<BmrProps> = observer(
  ({navigation, personStore, langStore}: BmrProps) => {
    const {currentLanguage} = langStore;
    const {
      data,
      getActivityLevel,
      getActivityR,
      updateInfo,
      currentWeight,
    } = personStore;

    const [arrInfo, setArrInfo] = useState([
      parseInt(data.target.calo.toFixed(0)),
      data.height,
      currentWeight,
      data.age,
      data.sex,
      parseInt(data.activity),
      data.target.status,
      data.target.weight ? data.target.weight : currentWeight,
    ]);
    const [showPopup, setShowPopup] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);

    const ItemSetting = ({item}) => {
      return (
        <TouchableOpacity style={styles.itemSetting} onPress={item.action}>
          <Text style={styles.itemSettingText}>{item.label}</Text>
          <Text style={styles.itemSettingText}>{item.info}</Text>
        </TouchableOpacity>
      );
    };

    const dataSetting = [
      {
        label: currentLanguage.BMR.kCalDay,
        info: arrInfo[0],
        action: () => actionItem(0),
      },
      {
        label: currentLanguage.BMR.height,
        info: arrInfo[1],
        action: () => actionItem(1),
      },
      {
        label: currentLanguage.BMR.weight,
        info: arrInfo[2],
        action: () => actionItem(2),
      },
      {
        label: currentLanguage.BMR.age,
        info: arrInfo[3],
        action: () => actionItem(3),
      },
      {
        label: currentLanguage.BMR.gender,
        info:
          arrInfo[4] == 1
            ? currentLanguage.BMR.male
            : currentLanguage.BMR.female,
        action: () => actionItem(4),
      },
      {
        label: currentLanguage.BMR.activityLevel,
        info: getActivityLevel(arrInfo[5]),
        action: () => {
          navigation.navigate('ActivitySelection', {
            updateActivityLevel,
            activityLevel: arrInfo[5],
          });
        },
      },
    ];

    const actionItem = (index: number) => {
      setCurrIndex(index);
      setShowPopup(true);
    };

    const updateBrmItem = (value: string) => {
      let val = 0;
      try {
        val = parseFloat(value);
      } catch (error) {}
      let arr = [...arrInfo];
      arr[currIndex] = val;
      if (currIndex !== 0) arr[0] = calculatorCalo(arr);
      setArrInfo(arr);
      setShowPopup(false);
    };

    const updateActivityLevel = (index: number) => {
      let arr = [...arrInfo];
      arr[5] = index;
      arr[0] = calculatorCalo(arr);
      setArrInfo(arr);
    };

    const calculatorCalo = (arrInfo: Array<number>) => {
      let activityR = getActivityR(arrInfo[5]!);
      let tdee =
        staticBRM(arrInfo[4]!, arrInfo[2]!, arrInfo[1]!, arrInfo[3]!) *
        activityR;
      let totalCalo = tdee + (arrInfo[6]! - 1) * 500;
      return parseInt(totalCalo.toFixed(0));
    };

    const updateTarget = (status: number, targetWeight: number) => {
      console.log('updateTarget: ', status, targetWeight);
      let arr = [...arrInfo];
      arr[6] = status;
      arr[7] = targetWeight;
      arr[0] = calculatorCalo(arr);
      setArrInfo(arr);
    };

    const setTarget = () => {
      navigation.navigate('TargetSelection', {
        updateTarget,
        currentWeight: arrInfo[2],
        currentStatus: arrInfo[6],
      });
    };

    const goBack = () => {
      updateInfo(arrInfo);
      navigation.goBack();
    };

    const backAction = () => {
      goBack();
      return true;
    };

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => {
        backHandler?.remove();
      };
    }, []);

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          leftAction={goBack}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.titleUpdateBRM}
            </Text>
          }
        />
        <TouchableOpacity style={styles.targetContainer} onPress={setTarget}>
          <Text style={styles.targetText}>
            {currentLanguage.BMR.buttonChangeGoals}
          </Text>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={styles.containerScroll}
          data={dataSetting}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <ItemSetting item={item} />}
        />

        {showPopup && (
          <InputPopup
            sex={currIndex === 4}
            title={dataSetting[currIndex].label}
            btnOk={currentLanguage.BMR.weightStat.popupBtnTitle}
            btnCancel={currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
            value={arrInfo[currIndex] + ''}
            actionCancel={() => {
              setShowPopup(false);
            }}
            actionOk={(val) => updateBrmItem(val)}
            langStore={langStore}
          />
        )}
      </View>
    );
  },
);

export default BmrUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
    alignItems: 'center',
  },
  btnBack: {},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.White,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: AppStyle.Color.White,
    paddingBottom: 56,
  },
  titleInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  itemSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    height: 40,
    width: AppStyle.Screen.FullWidth - 48,
    marginHorizontal: 24,
    padding: 4,
  },
  itemSettingText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  targetContainer: {
    height: 40,
    padding: 8,
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: AppStyle.Color.Green,
    borderWidth: 1,
  },
  targetText: {
    fontSize: 14,
    textAlign: 'center',
    color: AppStyle.Color.Green,
  },
});
