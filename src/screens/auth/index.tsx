import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getDataDoc} from '../../services/firebase';
import {getDataLocal, saveDataLocal} from '../../services/storage';
import LanguageStore from '../../shared/store/language';
import UIStore from '../../shared/store/ui';
import UserStore, {User} from '../../shared/store/user';
import AuthButton from '../../shared/ui/components/auth_button';
import AppStyle from '../../shared/ui/styles/app.style';
import {
  FIR_KEY_DB,
  FIR_KEY_USER_ID,
  GOOGLE_CLIENT_ID,
} from '../../utils/config/setting';
import {ENTERED_INFOMATION, ENTERED_INFORMATION_KEY} from '../../utils/consts';
import {
  BG,
  IC_APPLE,
  IC_EMAIL,
  IC_FACEBOOK,
  IC_GOOGLE,
} from '../../utils/icons';
import IntroAppItem from '../../shared/ui/containers/native-ads/intro_item';
import SubStore from '../../shared/store/sub';
import {heightHeader} from '../../shared/ui/styles/common.style';
import {getUniqueId} from 'react-native-device-info';
import Spinner from 'react-native-spinkit';

type AuthProps = {
  navigation: any;
  rootNavigation: any;
  userStore: UserStore;
  uiStore: UIStore;
  subStore: SubStore;
  langStore: LanguageStore;
};

const AuthView: React.FC<AuthProps> = observer(
  ({
    navigation,
    rootNavigation,
    userStore,
    uiStore,
    subStore,
    langStore,
  }: AuthProps) => {
    const {currentLanguage} = langStore;
    // const [userId, changeUserState] = useState();
    // const onAuthStateChanged = user => {
    //   console.log('onAuthStateChanged: ', user);
    //   userStore.setUser(user);
    //   if (user) {
    //     saveDataLocal(FIR_KEY_USER_ID, user.uid);
    //     // changeUserState(user.uid);
    //     introAppOnpress(user);
    //   }
    // };

    useEffect(() => {
      // const backHandler = BackHandler.addEventListener(
      //   'hardwareBackPress',
      //   backAction,
      // );
      // GoogleSignin.configure({
      //   webClientId: GOOGLE_CLIENT_ID,
      // });
      // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      // return () => {
      //   backHandler.remove();
      //   subscriber;
      // };
      getUniqueId().then(id => {
        saveDataLocal(FIR_KEY_USER_ID, id);
        introAppOnpress({uid: id, displayName: 'User ' + id, photoURL: ''});
      });
    }, []);

    const [loginStatus, setLoginStatus] = useState(0);

    const onAppleLogin = () => {
      userStore.signInApple(uiStore);
    };
    const onGoogleLogin = () => {
      userStore.signInGoogle(uiStore);
    };
    const onAnonymousLogin = () => {
      userStore.signInAnonymous(uiStore);
    };
    const onOpenEmailLogin = () => {
      setLoginStatus(1);
    };
    const onEmailLogin = () => {
      if (userStore.email === '' || userStore.password === '') {
        Alert.alert('Error', 'The password or email field is empty!');
        return;
      }
      userStore.signInWithEmail(uiStore);
    };
    const onOpenRegister = () => {
      setLoginStatus(2);
    };
    const onRegister = () => {
      if (userStore.email === '' || userStore.password === '') {
        Alert.alert('Error', 'The password or email field is empty!');
        return;
      }
      userStore.signUpWithEmail(uiStore);
    };
    const goBack = () => {
      if (loginStatus > 0) {
        let status = loginStatus - 1;
        setLoginStatus(status);
      }
    };
    const backAction = () => {
      goBack();
      return true;
    };

    const introAppOnpress = async (user: User) => {
      uiStore.hideNativeAds();
      uiStore.showLoading('login');
      // const isEnteredInfo = await getDataLocal(ENTERED_INFORMATION_KEY);
      // if (isEnteredInfo === ENTERED_INFOMATION.entered) {
      //   rootNavigation.navigate('BottomTabbar');
      // } else {
      //   let data = await getDataDoc(`${FIR_KEY_DB}/${user && user.uid}`);
      //   if (data) {
      //     rootNavigation.navigate('BottomTabbar');
      //     saveDataLocal(ENTERED_INFORMATION_KEY, ENTERED_INFOMATION.entered);
      //   } else {
      //     navigation.navigate('InputInformation');
      //   }
      // }
      let data = await getDataDoc(`${FIR_KEY_DB}/${user && user.uid}`);
      console.log('introAppOnpress data: ', data);

      if (data) {
        rootNavigation.navigate('BottomTabbar');
        saveDataLocal(ENTERED_INFORMATION_KEY, ENTERED_INFOMATION.entered);
      } else {
        navigation.navigate('InputInformation');
      }
      uiStore.hideLoading();
      // rootNavigation.navigate('BottomTabbar');
    };

    if (loginStatus === 0) {
      return (
        <View style={{flex: 1}}>
          <View>
            <Image source={BG} style={styles.bg} />
            <View style={styles.bg_blur} />
          </View>
          <View style={styles.container}>
            {/* {Platform.OS === 'ios' && (
              <AuthButton
                containerStyle={[
                  styles.button,
                  {backgroundColor: AppStyle.Color.White},
                ]}
                icon={IC_APPLE}
                title={currentLanguage.login.signinWithApple}
                action={onAppleLogin}
              />
            )}
            <AuthButton
              containerStyle={styles.button}
              titleStyle={styles.title}
              icon={IC_EMAIL}
              title={currentLanguage.login.signinWithEmail}
              action={onOpenEmailLogin}
            />
            <AuthButton
              containerStyle={[
                styles.button,
                {backgroundColor: AppStyle.Color.White},
              ]}
              titleStyle={styles.titleBlack}
              icon={IC_GOOGLE}
              title={currentLanguage.login.signinWithGoogle}
              action={onGoogleLogin}
            />
            <View style={styles.btnDirectContainer}>
              <TouchableOpacity
                style={[styles.btnDirect, {}]}
                onPress={onAnonymousLogin}>
                <Icon name="arrow-right" size={24} color="#00000070" />
              </TouchableOpacity>
            </View> */}
          </View>
          {/* {uiStore.showNativeAds && userId && (
            <View style={styles.containerNativeAds}>
              <IntroAppItem
                modifierStyle={{
                  width: '85%',
                  marginTop: getStatusBarHeight(),
                  marginBottom: 16,
                  marginRight: 0,
                  marginLeft: 'auto',
                }}
                onPress={introAppOnpress}
              />
              <NativeAds
                children={<ImageView style={styles.nativeAds} />}
                media
                type="image"
              />
            </View>
          )} */}
        </View>
      );
    } else if (loginStatus === 1) {
      return (
        <View style={{flex: 1}}>
          <View>
            <Image source={BG} style={styles.bg} />
            <View style={styles.bg_blur} />
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              value={userStore.email}
              placeholder={currentLanguage.login.loginSignupEmail.email}
              onChangeText={userStore.setEmail}
            />
            <TextInput
              style={styles.input}
              value={userStore.password}
              placeholder={currentLanguage.login.loginSignupEmail.password}
              onChangeText={userStore.setPassword}
            />
            <AuthButton
              containerStyle={[styles.button, {justifyContent: 'center'}]}
              titleStyle={[styles.title, {marginLeft: 0}]}
              // icon={IC_GOOGLE}
              title={currentLanguage.login.loginSignupEmail.login}
              action={onEmailLogin}
            />
            <TouchableOpacity onPress={onOpenRegister}>
              <Text style={styles.text}>
                {currentLanguage.login.loginSignupEmail.createAnAccount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnDirect,
                {position: 'absolute', top: getStatusBarHeight(), left: 16},
              ]}
              onPress={goBack}>
              <Icon name="arrow-left" size={24} color="#00000070" />
            </TouchableOpacity>
          </View>
          {/* {uiStore.showNativeAds && userId && (
            <View style={styles.containerNativeAds}>
              <IntroAppItem
                modifierStyle={{
                  width: '85%',
                  marginTop: getStatusBarHeight(),
                  marginBottom: 16,
                  marginRight: 0,
                  marginLeft: 'auto',
                }}
                onPress={introAppOnpress}
              />
              <NativeAds
                children={<ImageView style={styles.nativeAds} />}
                media
                type="image"
              />
            </View>
          )} */}
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <View>
            <Image source={BG} style={styles.bg} />
            <View style={styles.bg_blur} />
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              value={userStore.email}
              placeholder={currentLanguage.login.loginSignupEmail.email}
              onChangeText={userStore.setEmail}
            />
            <TextInput
              style={styles.input}
              value={userStore.password}
              placeholder={currentLanguage.login.loginSignupEmail.password}
              onChangeText={userStore.setPassword}
            />
            <AuthButton
              containerStyle={[styles.button, {justifyContent: 'center'}]}
              titleStyle={[styles.title, {marginLeft: 0}]}
              // icon={IC_GOOGLE}
              title={currentLanguage.login.loginSignupEmail.createAccount}
              action={onRegister}
            />
            <TouchableOpacity
              style={[
                styles.btnDirect,
                {position: 'absolute', top: getStatusBarHeight(), left: 16},
              ]}
              onPress={goBack}>
              <Icon name="arrow-left" size={24} color="#00000070" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  },
);

export default AuthView;

const styles = StyleSheet.create({
  bg: {
    width: AppStyle.Screen.FullWidth,
    height: AppStyle.Screen.FullHeight,
    resizeMode: 'cover',
  },
  bg_blur: {
    position: 'absolute',
    width: AppStyle.Screen.FullWidth,
    height: AppStyle.Screen.FullHeight,
    backgroundColor: '#00000020',
  },
  container: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
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
  button: {
    backgroundColor: AppStyle.Color.Green,
    marginVertical: 10,
  },
  title: {
    color: AppStyle.Color.White,
  },
  titleBlack: {
    color: AppStyle.Color.Black1,
  },
  input: {
    backgroundColor: AppStyle.Color.White,
    width: AppStyle.Screen.FullWidth - 96,
    height: 48,
    padding: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginVertical: 16,
  },
  text: {
    padding: 8,
    textAlign: 'center',
    color: AppStyle.Color.White,
  },
  btnDirectContainer: {
    width: '100%',
    paddingHorizontal: 48,
    alignItems: 'flex-end',
    marginTop: 4,
  },
  btnDirect: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF80',
  },
  containerNativeAds: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00000080',
  },
  nativeAds: {
    height: Dimensions.get('window').height - heightHeader,
    width: '100%',
    resizeMode: 'contain',
  },
});
