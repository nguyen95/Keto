import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppStyle from '../styles/app.style';
import {heightFooter} from '../styles/common.style';

type BaseFooterProps = {
  element: any;
};

const BaseFooter: React.FC<BaseFooterProps> = ({element}: BaseFooterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>{element}</View>
    </View>
  );
};

export default BaseFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 80,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    backgroundColor: AppStyle.Color.Background,
  },
  footerContainer: {
    marginBottom: heightFooter,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: AppStyle.Color.LightGray,
    borderTopWidth: 1,
  },
});
