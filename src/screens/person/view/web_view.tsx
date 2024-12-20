import {observer} from 'mobx-react';
import React, {useEffect} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {WebView} from 'react-native-webview';
import UIStore from '../../../shared/store/ui';
import AppStyle from '../../../shared/ui/styles/app.style';
import {heightHeader} from '../../../shared/ui/styles/common.style';
import {IC_BACK} from '../../../utils/icons';

type PDFViewProps = {
  navigation: any;
  route: any;
  uiStore: UIStore;
};

const MyWebView: React.FC<PDFViewProps> = observer(
  ({route, navigation, uiStore}: PDFViewProps) => {
    const {title, url} = route.params;
    useEffect(() => {
      return () => {};
    }, []);

    const goBack = () => {
      navigation.goBack();
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Image source={IC_BACK} style={styles.icon} />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            lineBreakMode="tail"
            style={styles.headerTitle}>
            {title}
          </Text>
        </View>
        <WebView
          androidHardwareAccelerationDisabled={true}
          source={{uri: url}}
          style={{flex: 1, width: AppStyle.Screen.FullWidth}}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
  },
  headerContainer: {
    height:
      Platform.OS === 'android'
        ? heightHeader
        : heightHeader - getStatusBarHeight(),
    width: '100%',
    backgroundColor: AppStyle.Color.Background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  iconSmall: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconLarge: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default MyWebView;
