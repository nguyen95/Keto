import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {IC_BACK} from '../../../utils/icons';
import BaseHeader from '../../../shared/ui/containers/base_header';
import LanguageStore from '../../../shared/store/language';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import {getDataLocal} from '../../../services/storage';
import {FIR_KEY_DB, FIR_KEY_USER_ID} from '../../../utils/config/setting';
import {updateDataDoc} from '../../../services/firebase';
import UIStore from '../../../shared/store/ui';
import {observer} from 'mobx-react';
import PersonStore from '../store';
import InputPopup from '../../../shared/ui/components/input_popup';

type TargetOption = {
  id: number;
  title: string;
  subTitle: string;
};

type TargetSelectionProps = {
  navigation: any;
  uiStore: UIStore;
  personStore: PersonStore;
  langStore: LanguageStore;
  route: any;
};

const TargetSelection: React.FC<TargetSelectionProps> = observer(
  ({navigation, uiStore, langStore, route}: TargetSelectionProps) => {
    const {currentLanguage} = langStore;
    const {updateTarget, currentWeight, currentStatus} = route.params;

    const [showWeightPopup, setShowWeightPopup] = useState(false);
    const [targetWeight, setTargetWeight] = useState(currentWeight);
    const targetOptions: Array<TargetOption> = [
      {
        id: 0,
        title: currentLanguage.BMR.yourGoals.loseWeightTitle,
        subTitle: currentLanguage.BMR.yourGoals.loseWeightSubTitle,
      },
      {
        id: 1,
        title: currentLanguage.BMR.yourGoals.maintainWeightTitle,
        subTitle: currentLanguage.BMR.yourGoals.maintainWeightSubTitle,
      },
      {
        id: 2,
        title: currentLanguage.BMR.yourGoals.gainWeightTitle,
        subTitle: currentLanguage.BMR.yourGoals.gainWeightSubTitle,
      },
    ];

    const [curOptionIdx, changeOption] = useState(currentStatus);

    const selectOption = async (index: number) => {
      console.log('selectOption: ', index);
      changeOption(index);
      if (index == 1) {
        updateStore(targetWeight, index);
      } else {
        setShowWeightPopup(true);
      }
    };

    const checkTargetWeightUpdate = (value: string) => {
      console.log('checkTargetWeightUpdate: ', value);
      let val = 0;
      try {
        val = parseFloat(value);
      } catch (error) {}
      if (curOptionIdx == 0) {
        if (val >= currentWeight) {
          Alert.alert(
            currentLanguage.BMR.yourGoals.errMsgTitle,
            currentLanguage.BMR.yourGoals.loseWeightErrMsg,
          );
        } else {
          setTargetWeight(val);
          updateStore(val);
        }
      } else {
        if (val <= currentWeight) {
          Alert.alert(
            currentLanguage.BMR.yourGoals.errMsgTitle,
            currentLanguage.BMR.yourGoals.gainWeightErrMsg,
          );
        } else {
          setTargetWeight(val);
          updateStore(val);
        }
      }
    };

    const updateStore = (weight: number, index?: number) => {
      let ind = index ? index : curOptionIdx;
      updateTarget(ind, weight);
      navigation.goBack();
    };

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.yourGoals.title}
            </Text>
          }
          leftAction={() => navigation.goBack()}
        />
        <Text style={[styles.title, {paddingVertical: 20}]}>
          {currentLanguage.BMR.yourGoals.question}
        </Text>
        {targetOptions.map((option) => {
          return (
            <TouchableOpacity
              style={[
                styles.optionContainer,
                curOptionIdx === option.id && {
                  borderColor: AppStyle.Color.Main,
                  borderWidth: 1,
                },
              ]}
              onPress={() => selectOption(option.id)}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.normalText}>{option.subTitle}</Text>
            </TouchableOpacity>
          );
        })}
        {showWeightPopup && (
          <InputPopup
            title={currentLanguage.BMR.yourGoals.title + ' (kg)'}
            btnOk={currentLanguage.BMR.continue}
            btnCancel={currentLanguage.BMR.weightStat.popupBtnSkipeTitle}
            value={targetWeight + ''}
            actionCancel={() => {
              setShowWeightPopup(false);
            }}
            actionOk={(val) => {
              checkTargetWeightUpdate(val);
            }}
            langStore={langStore}
          />
        )}
      </View>
    );
  },
);

export default TargetSelection;

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
    color: AppStyle.Color.Main,
    textAlign: 'center',
    width: '100%',
  },
  normalText: {
    fontSize: AppStyle.Text.Normal,
    textAlign: 'center',
    padding: 5,
  },
  optionContainer: {
    width: '80%',
    minHeight: 60,
    margin: 10,
    padding: 10,
    backgroundColor: AppStyle.Color.Background,
    borderRadius: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
