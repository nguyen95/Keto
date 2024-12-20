import React from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import UIStore from '../../store/ui';
import Spinner from 'react-native-spinkit';
import AppStyle from '../styles/app.style';
import {observer} from 'mobx-react';

type UICommonProps = {
  store: UIStore;
};

const UICommon: React.FC<UICommonProps> = observer(({store}: UICommonProps) => {
  return store.shouldShowLoading ? (
    <View style={styles.container}>
      <Spinner
        type={Platform.OS === 'ios' ? 'Arc' : 'Circle'}
        color={AppStyle.Color.White}
        isVisible={store?.shouldShowLoading}
      />
      {!!store?.curLoadingMess && (
        <Text style={styles.spinnerTextStyle}>{store?.curLoadingMess}</Text>
      )}
    </View>
  ) : null;
});

export default UICommon;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10001,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.3,
  },
  spinnerTextStyle: {
    fontSize: AppStyle.Text.Normal,
    color: AppStyle.Color.White,
    marginTop: 10,
  },
});
