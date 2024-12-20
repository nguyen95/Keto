import React, {useState} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import LanguageStore from '../../store/language';
import {} from '../../../utils/icons';
import AppStyle from '../styles/app.style';

type PopupProps = {
  sex?: boolean;
  title: string;
  value: string;
  btnOk: string;
  btnCancel: string;
  actionOk: (value: string) => void;
  actionCancel: () => void;
  langStore: LanguageStore;
};

const InputPopup: React.FC<PopupProps> = ({
  sex,
  title,
  value,
  btnOk,
  btnCancel,
  actionOk,
  actionCancel,
  langStore,
}: PopupProps) => {
  const {currentLanguage} = langStore;
  const [state, setState] = useState(value);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.containerPopup}
      onPressOut={() => {
        actionCancel();
      }}>
      <TouchableWithoutFeedback style={{}}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {sex ? (
            <View style={{marginVertical: 12}}>
              <CheckBox
                containerStyle={{backgroundColor: 'white', borderWidth: 0}}
                center
                title={currentLanguage.BMR.male}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={AppStyle.Color.Main}
                uncheckedColor={AppStyle.Color.Main}
                checked={state === '1'}
                onPress={() => setState('1')}
              />
              <CheckBox
                containerStyle={{backgroundColor: 'white', borderWidth: 0}}
                center
                title={currentLanguage.BMR.female}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={AppStyle.Color.Main}
                uncheckedColor={AppStyle.Color.Main}
                checked={state === '0'}
                onPress={() => setState('0')}
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              numberOfLines={1}
              value={state}
              keyboardType="numeric"
              autoFocus={true}
              onChangeText={(val) => setState(val)}
            />
          )}
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.btn} onPress={actionCancel}>
              <Text style={styles.btnTextCancel}>{btnCancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                actionOk(state);
                actionCancel();
              }}>
              <Text style={styles.btnTextOK}>{btnOk}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  );
};

export default InputPopup;

const styles = StyleSheet.create({
  containerPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: AppStyle.Color.White,
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  input: {
    margin: 24,
    marginVertical: 16,
    fontSize: 26,
    fontWeight: '600',
    width: '80%',
    height: 50,
    textAlign: 'center',
    backgroundColor: AppStyle.Color.LightGray,
  },
  btnView: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btn: {
    padding: 8,
    paddingHorizontal: 16,
  },
  btnTextOK: {
    fontSize: 18,
    color: AppStyle.Color.Main,
    fontWeight: '600',
    textAlign: 'center',
  },
  btnTextCancel: {
    fontSize: 16,
    color: 'red',
    fontWeight: '500',
    textAlign: 'center',
  },
});
