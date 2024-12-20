import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import LanguageStore from '../../../shared/store/language';
import BaseHeader from '../../../shared/ui/containers/base_header';
import ActivityForm, {FormValues} from './activity_form';
import AppStyle from '../../../shared/ui/styles/app.style';
import {ScrollView} from 'react-native-gesture-handler';
import SexItem from './sex_item';
import CountItem from './count_item';
import {addDataDoc, updateDataDoc} from '../../../services/firebase';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {alertInfo} from '../../../utils/functions';
import UIStore from 'shared/store/ui';
import {getDataLocal} from '../../../services/storage';
import {staticActivityLevel} from '../../../services/static_calo';

type HeightData = {
  unit: 'cm' | 'inch';
  value: number;
  maxValue: number;
};

type WeightData = {
  unit: 'kg' | 'lbs';
  value: number;
};

type InputInformationProps = {
  navigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
};

const InputInformation: React.FC<InputInformationProps> = ({
  navigation,
  uiStore,
  langStore,
}: InputInformationProps) => {
  const {currentLanguage} = langStore;
  const [curAct, changeCurAct] = useState<FormValues>();
  const [curSex, changeCurSex] = useState<'male' | 'female'>('male');
  const [curHeight, changeCurHeight] = useState<HeightData>({
    unit: 'cm',
    value: 180,
    maxValue: 300,
  });
  const [curWeight, changeCurWeight] = useState<WeightData>({
    unit: 'kg',
    value: 50,
  });
  const [curAge, changeCurAge] = useState<number>(20);
  const [userId, changeUserId] = useState<string>();

  const activityChanged = (values: FormValues) => {
    changeCurAct(values);
  };

  const saveDataToFirebaseDb = async () => {
    if (!curAct) {
      alertInfo('', 'Please enter activity.', false, () => {
        return;
      });
    } else {
      uiStore.showLoading('submit');
      if (!userId) {
        const id = await getDataLocal(FIR_KEY_USER_ID);
        await addDataDoc(`${FIR_KEY_DB}/${id}`, {
          id: id,
          activity: staticActivityLevel(curAct?.minutes, curAct?.days) + '',
          sex: curSex === 'male' ? 1 : 0,
          height: curHeight.value,
          weight: curWeight.value,
          age: curAge,
        });
        changeUserId(id);
      } else {
        await updateDataDoc(`${FIR_KEY_DB}/${userId}`, {
          activity: `${curAct?.minutes} - ${curAct?.days}`,
          sex: curSex === 'male' ? 1 : 0,
          height: curHeight.value,
          weight: curWeight.value,
          age: curAge,
        });
      }
      uiStore.hideLoading();
      navigation.navigate('TargetSelection', {userId});
    }
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={null}
        rightElement={null}
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.BMR.title}
          </Text>
        }
      />
      <ScrollView style={styles.container}>
        <ActivityForm onChangeForm={activityChanged} langStore={langStore} />
        <View style={styles.subContainer}>
          <View style={styles.sexForm}>
            <TouchableOpacity
              style={styles.sexItem}
              onPress={() => changeCurSex('male')}>
              <SexItem
                isSelected={curSex === 'male'}
                type="male"
                langStore={langStore}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sexItem}
              onPress={() => changeCurSex('female')}>
              <SexItem
                isSelected={curSex === 'female'}
                type="female"
                langStore={langStore}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerHeightForm}>
            <Text>{currentLanguage.BMR.height} (cm)</Text>
            <Text style={styles.countText}>{curHeight.value}</Text>
            {/* <SegmentedControl
              values={['cm', 'inch']}
              selectedIndex={curHeight.unit === 'cm' ? 0 : 1}
              onChange={(event) => {
                const oldHeight = curHeight;
                oldHeight.unit =
                  event.nativeEvent.selectedSegmentIndex === 0 ? 'cm' : 'inch';
                changeCurHeight(oldHeight);
              }}
            /> */}
            <Slider
              style={styles.slider}
              value={curHeight.value}
              thumbTintColor={AppStyle.Color.Main}
              maximumTrackTintColor={AppStyle.Color.Secondary}
              minimumTrackTintColor={AppStyle.Color.Main}
              minimumValue={1}
              maximumValue={curHeight.maxValue}
              step={1}
              onValueChange={(value: number) => {
                const oldHeight = {...curHeight};
                oldHeight.value = value;
                changeCurHeight(oldHeight);
              }}
            />
          </View>
          <View style={styles.weightAgeGroup}>
            <CountItem
              type="weight"
              changeCountValue={(value: number) => {
                const oldWeight = {...curWeight};
                oldWeight.value = value;
                changeCurWeight(oldWeight);
              }}
              langStore={langStore}
            />
            <CountItem
              type="age"
              changeCountValue={(value: number) => {
                changeCurAge(value);
              }}
              langStore={langStore}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={saveDataToFirebaseDb}>
          <Text style={{color: AppStyle.Color.White}}>
            {currentLanguage.BMR.continue}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InputInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.LightGray,
  },
  subContainer: {
    backgroundColor: AppStyle.Color.White,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
  },
  sexForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppStyle.Color.White,
    borderRadius: 10,
    padding: 20,
  },
  sexItem: {
    width: Dimensions.get('window').width / 3,
  },
  headerHeightForm: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slider: {
    width: '80%',
    alignSelf: 'center',
  },
  countText: {
    textAlign: 'center',
    width: '100%',
    fontSize: AppStyle.Text.Large,
    fontWeight: 'bold',
    color: 'red',
  },
  weightAgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
});
