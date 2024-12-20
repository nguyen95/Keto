import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import BaseTextInput from '../../../shared/ui/components/base_text_input';
import LanguageStore from '../../../shared/store/language';
import AppStyle from '../../../shared/ui/styles/app.style';

export type FormValues = {
  minutes: number;
  days: number;
};

type ActivityFormProps = {
  onChangeForm: (values: FormValues) => void;
  langStore: LanguageStore;
};

const ActivityForm: React.FC<ActivityFormProps> = ({
  onChangeForm,
  langStore,
}: ActivityFormProps) => {
  const {currentLanguage} = langStore;
  const [formValues, changeFormValues] = useState<FormValues>({
    minutes: 0,
    days: 0,
  });

  const onMinusChanged = (text: string) => {
    let curValues: FormValues = formValues;
    curValues.minutes = Number(text);
    changeFormValues(curValues);
    onChangeForm(curValues);
  };
  const onDaysChanged = (text: string) => {
    let curValues: FormValues = formValues;
    curValues.days = Number(text);
    changeFormValues(curValues);
    onChangeForm(curValues);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentLanguage.BMR.trackingActivity.title}
      </Text>
      <View style={styles.inputForm}>
        <BaseTextInput
          modifierStyle={{width: Dimensions.get('window').width / 4}}
          onText={onMinusChanged}
          placeHolder={currentLanguage.BMR.trackingActivity.spentTime1DayAmout}
          keyboardType="numeric"
        />
        <Text style={{fontWeight: 'bold'}}>
          {currentLanguage.BMR.trackingActivity.spentTime1Day}
        </Text>
      </View>
      <View style={styles.inputForm}>
        <BaseTextInput
          modifierStyle={{width: Dimensions.get('window').width / 4}}
          onText={onDaysChanged}
          placeHolder={
            currentLanguage.BMR.trackingActivity.spentTimes1WeekAmount
          }
          keyboardType="numeric"
        />
        <Text style={{fontWeight: 'bold'}}>
          {currentLanguage.BMR.trackingActivity.spentTimes1Week}
        </Text>
      </View>
    </View>
  );
};

export default ActivityForm;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 20,
    height: 200,
    backgroundColor: AppStyle.Color.White,
  },
  title: {
    flex: 1,
    fontSize: AppStyle.Text.Large,
    textAlign: 'center',
  },
  inputForm: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
