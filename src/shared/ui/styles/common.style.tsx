import {StyleSheet, Platform} from 'react-native';
import AppStyle from './app.style';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';

export const heightHeader = 64 + (Platform.OS === 'ios' ? getStatusBarHeight(true) : 0);
export const heightFooter = getBottomSpace();

export const commonStyles = StyleSheet.create({
  headerTitle: {
    color: AppStyle.Color.White,
    fontWeight: 'bold',
    fontSize: AppStyle.Text.Large,
    textAlign: 'center',
    alignSelf: 'center',
    flexGrow: 1,
  },
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: AppStyle.Color.LightGray,
  },
  backButtonHeader: {
    paddingLeft: 10,
    width: 40,
  },
  headerButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.Dark,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
});
