import React, {useState} from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
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

const ActivitySelection: React.FC<TargetSelectionProps> = observer(
  ({
    navigation,
    uiStore,
    personStore,
    langStore,
    route,
  }: TargetSelectionProps) => {
    const {currentLanguage} = langStore;
    const {updateActivityLevel, activityLevel} = route.params;
    const targetOptions: Array<TargetOption> = [
      {
        id: 0,
        title: currentLanguage.BMR.activityLevelMsg.littleOrNoExercise.title,
        subTitle:
          currentLanguage.BMR.activityLevelMsg.littleOrNoExercise.subtitle,
      },
      {
        id: 1,
        title: currentLanguage.BMR.activityLevelMsg.lightExercise.title,
        subTitle: currentLanguage.BMR.activityLevelMsg.lightExercise.subtitle,
      },
      {
        id: 2,
        title: currentLanguage.BMR.activityLevelMsg.moderateExercise.title,
        subTitle:
          currentLanguage.BMR.activityLevelMsg.moderateExercise.subtitle,
      },
      {
        id: 3,
        title: currentLanguage.BMR.activityLevelMsg.veryActive.title,
        subTitle: currentLanguage.BMR.activityLevelMsg.veryActive.subtitle,
      },
      {
        id: 4,
        title: currentLanguage.BMR.activityLevelMsg.extraActive.title,
        subTitle: currentLanguage.BMR.activityLevelMsg.extraActive.subtitle,
      },
    ];

    const [curOptionIdx, changeOption] = useState(activityLevel);

    const selectOption = async (index: number) => {
      console.log('selectOption: ', index);
      changeOption(index);
      updateActivityLevel(index);
      navigation.goBack();
    };

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.BMR.activityLevel}
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
      </View>
    );
  },
);

export default ActivitySelection;

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
