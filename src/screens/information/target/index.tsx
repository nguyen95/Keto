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

type TargetOption = {
  id: number;
  title: string;
  subTitle: string;
};

type TargetSelectionProps = {
  navigation: any;
  uiStore: UIStore;
  langStore: LanguageStore;
};

const TargetSelection: React.FC<TargetSelectionProps> = ({
  navigation,
  uiStore,
  langStore,
}: TargetSelectionProps) => {
  const {currentLanguage} = langStore;
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

  const [curOptionIdx, changeOption] = useState(1);

  const selectOption = async (index: number) => {
    changeOption(index);

    const userId = await getDataLocal(FIR_KEY_USER_ID);
    await updateDataDoc(`${FIR_KEY_DB}/${userId}`, {
      target: {
        status: index,
      },
    });
    navigation.navigate('StaticInformation');
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
    </View>
  );
};

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
