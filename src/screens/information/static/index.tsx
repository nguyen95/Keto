import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {ScrollView} from 'react-native-gesture-handler';
import BaseHeader from '../../../shared/ui/containers/base_header';
import {getDataLocal, saveDataLocal} from '../../../services/storage';
import {
  ENTERED_INFOMATION,
  ENTERED_INFORMATION_KEY,
} from '../../../utils/consts';
import LanguageStore from '../../../shared/store/language';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import {getDataDoc, updateDataDoc} from '../../../services/firebase';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {
  staticBMI,
  staticLipid,
  staticTDEE,
} from '../../../services/static_calo';
import UIStore from '../../../shared/store/ui';

type StaticInformationProps = {
  navigation: any;
  rootNavigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
};

const StaticInformation: React.FC<StaticInformationProps> = ({
  rootNavigation,
  navigation,
  uiStore,
  langStore,
}: StaticInformationProps) => {
  const {currentLanguage} = langStore;
  const [tdeeVal, changeTDEE] = useState(0);
  const [bmiVal, changeBMI] = useState(0);
  const [weight, changeWeight] = useState<number>();
  const [height, changeHeight] = useState<number>();
  const [lipid, changeLipid] = useState<number>();

  useEffect(() => {
    async function loadDataFromDb() {
      const userId = await getDataLocal(FIR_KEY_USER_ID);
      const values = await getDataDoc(`${FIR_KEY_DB}/${userId}`);
      if (values) {
        const {activity, sex, weight, height, age, target} = values;
        const activityData = (activity as string).split('-');
        let minutes = 0;
        let days = 0;
        if (activityData.length > 1) {
          minutes = Number(activityData[0]);
          days = Number(activityData[1]);
        }

        const tdee = Math.round(
          staticTDEE(sex, weight, height, age, minutes, days),
        );
        switch (target.status) {
          case 0:
            changeTDEE(tdee - 500);
            break;
          case 1:
            changeTDEE(tdee);
            break;
          case 2:
            changeTDEE(tdee + 500);
            break;
        }

        const bmi = Math.round(staticBMI(weight, height / 100) * 10) / 10;
        const lipid = staticLipid(sex, weight, height / 100, age);
        changeBMI(bmi);
        changeWeight(weight);
        changeHeight(height);
        changeLipid(lipid);
      }
    }
    loadDataFromDb();
    return;
  }, []);

  function getBMIComment() {
    if (bmiVal < 18.5) {
      return currentLanguage.BMR.bmiComment.UNDERWEIGHT;
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      return currentLanguage.BMR.bmiComment.NORMAL;
    } else if (bmiVal >= 25) {
      return currentLanguage.BMR.bmiComment.OVERWEIGHT;
    } else {
      return currentLanguage.BMR.bmiComment.OBESE;
    }
  }

  const saveData = async () => {
    uiStore.showLoading('save');
    const id = await getDataLocal(FIR_KEY_USER_ID);
    await updateDataDoc(`${FIR_KEY_DB}/${id}`, {
      'target.calo': tdeeVal,
    });
    uiStore.hideLoading();
    navigation.popToTop();
    rootNavigation.navigate('BottomTabbar');
    saveDataLocal(ENTERED_INFORMATION_KEY, ENTERED_INFOMATION.entered);
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={null}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.BMR.yourResult}
          </Text>
        }
      />
      <ScrollView style={[styles.container, {paddingTop: 20}]}>
        <View style={styles.container}>
          <Text style={styles.title}>{currentLanguage.BMR.tdee}</Text>
          <View style={styles.tdeeContainer}>
            <View>
              <Text style={styles.numberMain}>{tdeeVal}</Text>
              <Text style={[styles.normalText, {color: 'red'}]}>
                {currentLanguage.BMR.kCalDay}
              </Text>
            </View>
            <View style={styles.circleContainer}>
              <Progress.Circle
                size={Dimensions.get('window').width / 4}
                color={'rgba(0, 122, 255, 0.2)'}
                progress={5000}
              />
              <View style={{position: 'absolute', alignSelf: 'center'}}>
                <Text style={[styles.title, {color: AppStyle.Color.Main}]}>
                  {tdeeVal}
                </Text>
                <Text
                  style={[
                    styles.normalText,
                    {
                      color: AppStyle.Color.TextGray,
                      fontSize: AppStyle.Text.Small,
                    },
                  ]}>
                  {currentLanguage.BMR.kCalLeft}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.container, {paddingTop: 10}]}>
          <Text style={styles.title}>{currentLanguage.BMR.BMI}</Text>
          <View style={styles.bmiContainer}>
            <View style={styles.bmiSubView}>
              <View>
                <Text style={styles.title}>BMI</Text>
                <Text style={styles.numberMain}>{bmiVal}</Text>
              </View>
            </View>
            <View style={styles.bmiSubView}>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={[styles.title, {paddingBottom: 5, color: 'black'}]}>
                  {lipid?.toFixed(1)}%
                </Text>
                <Text
                  style={[styles.normalText, {color: AppStyle.Color.TextGray}]}>
                  {currentLanguage.custom.lipid}
                </Text>
              </View>
              <View style={{alignContent: 'center'}}>
                <Text
                  style={[styles.normalText, {color: AppStyle.Color.TextGray}]}>
                  {new Date().toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.normalText,
                    {
                      color: AppStyle.Color.Orange,
                      paddingTop: 5,
                      textAlign: 'center',
                    },
                  ]}>
                  {currentLanguage.BMR.dateUpdateWeight}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: AppStyle.Color.LightGray,
                width: '90%',
                height: 1,
                alignSelf: 'center',
                marginVertical: 15,
              }}
            />
            <View style={styles.bmiSubView}>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.title, {paddingBottom: 5}]}>
                  {height} cm
                </Text>
                <Text
                  style={[styles.normalText, {color: AppStyle.Color.TextGray}]}>
                  {currentLanguage.BMR.height}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.title, {paddingBottom: 5}]}>
                  {weight} kg
                </Text>
                <Text
                  style={[styles.normalText, {color: AppStyle.Color.TextGray}]}>
                  {getBMIComment()}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.container, {paddingTop: 10}]}>
          <Text style={styles.title}>
            {currentLanguage.BMR.drinkWater.title}
          </Text>
          <View style={styles.waterContainer}>
            <View>
              <Text style={styles.numberMain}>
                1950{' '}
                <Text
                  style={[
                    styles.normalText,
                    {color: 'red'},
                  ]}>{`${currentLanguage.BMR.drinkWater.mlDay}`}</Text>
              </Text>
              <Text
                style={[styles.normalText, {color: AppStyle.Color.TextGray}]}>
                {currentLanguage.BMR.drinkWater.dailyGoal}
              </Text>
            </View>
            <View />
          </View>
        </View>
        <TouchableOpacity style={styles.continueBtn} onPress={saveData}>
          <Text style={{color: AppStyle.Color.White}}>
            {currentLanguage.BMR.gotIt}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default StaticInformation;

const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Background,
  },
  title: {
    fontSize: AppStyle.Text.Large,
    width: '100%',
    fontWeight: '500',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  continueBtn: {
    height: 40,
    width: '30%',
    borderRadius: 20,
    backgroundColor: AppStyle.Color.Orange,
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  tdeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppStyle.Color.White,
    borderRadius: 5,
    borderTopRightRadius: 50,
    margin: 10,
    padding: 30,
  },
  bmiContainer: {
    backgroundColor: AppStyle.Color.White,
    borderRadius: 5,
    borderTopRightRadius: 50,
    margin: 10,
    padding: 30,
  },
  weightSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  bmiSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.White,
    borderRadius: 5,
    borderTopRightRadius: 50,
    margin: 10,
    padding: 30,
  },
  numberMain: {
    color: 'red',
    fontWeight: '700',
    fontSize: 28,
  },
  normalText: {
    fontSize: AppStyle.Text.Normal,
    maxWidth: AppStyle.Screen.FullWidth / 2 - 48,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
