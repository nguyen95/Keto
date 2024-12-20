import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LanguageStore from '../../store/language';
import {IC_TIP} from '../../../utils/icons';
import AppStyle from '../styles/app.style';

type TipProps = {
  langStore: LanguageStore;
  tipDefault?: any;
};

const TipOfDay: React.FC<TipProps> = ({langStore}: TipProps) => {
  const {currentLanguage, currentTip, tipDefault} = langStore;
  let tip = currentTip[Math.floor(Math.random() * (currentTip.length - 1))];
  if (tipDefault) {
    tip = tipDefault;
  }
  return (
    <View style={styles.container}>
      <Image source={IC_TIP} style={styles.tipImage} resizeMode="contain" />
      <Text style={styles.tipSub}>{currentLanguage.BMR.tipOfTheDay}</Text>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipContent}>{tip.subTitle}</Text>
    </View>
  );
};

export default TipOfDay;

const styles = StyleSheet.create({
  container: {
    width: AppStyle.Screen.FullWidth - 48,
    margin: 24,
    padding: 32,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    backgroundColor: AppStyle.Color.White,
    alignItems: 'center',
  },
  tipImage: {
    width: 60,
    height: 60,
  },
  tipSub: {
    marginVertical: 12,
    fontSize: 16,
    color: AppStyle.Color.TextGray,
    textAlign: 'center',
  },
  tipTitle: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipContent: {
    marginVertical: 12,
    fontSize: 16,
    textAlign: 'left',
  },
});
