import React from 'react';
import {Dimensions, Image, StyleSheet, View, Text} from 'react-native';
import {IC_FEMALE, IC_MALE} from '../../../utils/icons';
import LanguageStore from '../../../shared/store/language';
import AppStyle from '../../../shared/ui/styles/app.style';

type SexItemProps = {
  isSelected: boolean;
  type: 'male' | 'female';
  langStore: LanguageStore;
};

const SexItem: React.FC<SexItemProps> = ({
  isSelected,
  type,
  langStore,
}: SexItemProps) => {
  const {currentLanguage} = langStore;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isSelected
            ? AppStyle.Color.Orange
            : AppStyle.Color.LightGray,
        },
      ]}>
      <Image
        style={[
          styles.icon,
          {
            tintColor: isSelected
              ? AppStyle.Color.White
              : AppStyle.Color.TabBarGray,
          },
        ]}
        source={type === 'male' ? IC_MALE : IC_FEMALE}
      />
      <Text
        style={[
          styles.title,
          {
            color: isSelected
              ? AppStyle.Color.White
              : AppStyle.Color.TabBarGray,
          },
        ]}>
        {type === 'male'
          ? currentLanguage.BMR.male
          : currentLanguage.BMR.female}
      </Text>
    </View>
  );
};

export default SexItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    flex: 1,
    width: Dimensions.get('window').width / 9,
    height: Dimensions.get('window').width / 9,
    resizeMode: 'contain',
  },
  title: {
    fontSize: AppStyle.Text.Medium,
    paddingTop: 10,
  },
});
