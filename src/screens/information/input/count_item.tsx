import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import AppStyle from '../../../shared/ui/styles/app.style';
import {IC_MINUS, IC_PLUS} from '../../../utils/icons';
import LanguageStore from '../../../shared/store/language';

type CountItemProps = {
  type: 'weight' | 'age';
  changeCountValue: (value: number) => void;
  langStore: LanguageStore;
};

const CountItem: React.FC<CountItemProps> = ({
  type,
  changeCountValue,
  langStore,
}: CountItemProps) => {
  const {currentLanguage} = langStore;
  const [curValue, changeValue] = useState(type === 'weight' ? 50 : 20);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'weight'
          ? `${currentLanguage.BMR.weight} (kg)`
          : currentLanguage.BMR.age}
      </Text>
      <Text style={styles.countText}>{curValue}</Text>
      <View style={styles.countGroup}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            if (curValue > 0) {
              changeValue(curValue - 1);
              changeCountValue(curValue - 1);
            }
          }}>
          <Image source={IC_MINUS} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            changeValue(curValue + 1);
            changeCountValue(curValue + 1);
          }}>
          <Image source={IC_PLUS} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CountItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppStyle.Color.LightGray,
    borderRadius: 10,
    margin: 20,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    width: '100%',
    fontSize: AppStyle.Text.Normal,
  },
  countText: {
    textAlign: 'center',
    width: '100%',
    fontSize: AppStyle.Text.Large,
    fontWeight: 'bold',
    color: 'red',
  },
  countGroup: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
  },
  icon: {
    width: Dimensions.get('window').width / 11,
    height: Dimensions.get('window').width / 11,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Main,
  },
});
