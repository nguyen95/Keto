import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import ActionSheet from 'react-native-actionsheet';
import LanguageStore from '../../../shared/store/language';
import UserStore from '../../../shared/store/user';
import BaseHeader from '../../../shared/ui/containers/base_header';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import AppStyle from '../../../shared/ui/styles/app.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CaloChart from '../../../shared/ui/components/calo_chart';
import {getDataLocal, saveDataLocal} from '../../../services/storage';
import {
  ENTERED_INFOMATION,
  ENTERED_INFORMATION_KEY,
} from '../../../utils/consts';
import {IC_BACK, IC_MORE} from '../../../utils/icons';
import {observer} from 'mobx-react';
import {
  about_us_link,
  email_support,
  itunes_store_url,
  play_store_url,
  policy_link,
} from '../../../utils/config/setting';
import UIStore from '../../../shared/store/ui';
import SubStore from '../../../shared/store/sub';

type SettingProps = {
  navigation: any;
  rootNavigation: any;
  userStore: UserStore;
  langStore: LanguageStore;
  uiStore: UIStore;
  subStore: SubStore;
};

const SettingScreen: React.FC<SettingProps> = observer(
  ({
    navigation,
    rootNavigation,
    userStore,
    langStore,
    uiStore,
    subStore,
  }: SettingProps) => {
    const {currentLanguage, langOptions, currentLanguageIdx} = langStore;
    let langActionSheet: any;

    function navigateToOtherScreen(screen: string) {
      navigation.navigate(screen);
    }

    const onClickFeedback = async () => {
      let url = `mailto:${email_support}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        if (Platform.OS === 'android') {
          Linking.openURL(play_store_url);
        } else {
          Linking.openURL(itunes_store_url);
        }
      }
    };

    const shareApp = async () => {
      const shareOptions = {
        title: '',
        url: Platform.OS === 'android' ? play_store_url : itunes_store_url,
      };
      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    };

    const onClickRateUs = () => {
      let url = Platform.OS === 'android' ? play_store_url : itunes_store_url;
      Linking.openURL(url);
    };

    const onClickAboutUs = () => {
      navigation.navigate('MyWebView', {
        title: 'Terms & Conditions',
        url: about_us_link,
      });
    };

    const onClickPolicyLink = () => {
      navigation.navigate('MyWebView', {
        title: 'Privacy policy',
        url: policy_link,
      });
    };

    const onClickMoreApp = () => {
      navigation.navigate('MoreApp');
    };

    const ItemSetting = ({item}) => {
      return (
        <TouchableOpacity style={styles.itemSetting} onPress={item.action}>
          <Icon name={item.icon} size={20} color="#000000" />
          <Text style={styles.itemSettingText}> {item.label}</Text>
        </TouchableOpacity>
      );
    };

    const restorePurchase = async () => {
      uiStore.showLoading('purchase');
      await subStore.getAvailablePurchases();
      uiStore.hideLoading();
    };

    const dataSetting = [
      {
        label: currentLanguage.setting.restorePurchase,
        icon: 'undo',
        action: restorePurchase,
      },
      {
        label: currentLanguage.setting.dataLocale,
        icon: 'globe-asia',
        action: () => {
          langActionSheet.show();
        },
      },
      {
        label: currentLanguage.setting.updateBMR,
        icon: 'user',
        action: () => {
          navigateToOtherScreen('BmrUpdateScreen');
        },
      },
      {
        label: currentLanguage.setting.nutrition,
        icon: 'hamburger',
        action: () => {
          navigateToOtherScreen('MacroScreen');
        },
      },
      {
        label: currentLanguage.setting.feedBack,
        icon: 'comment-alt',
        action: onClickFeedback,
      },
      {
        label: currentLanguage.setting.inviteFriend,
        icon: 'user-friends',
        action: shareApp,
      },
      {
        label: currentLanguage.setting.rateTheApp,
        icon: 'star',
        action: onClickRateUs,
      },
      {
        label: currentLanguage.setting.moreApp,
        icon: 'angle-double-right',
        action: onClickMoreApp,
      },
      {
        label: currentLanguage.setting.term,
        icon: 'info-circle',
        action: onClickAboutUs,
      },
      {
        label: currentLanguage.setting.policy,
        icon: 'info-circle',
        action: onClickPolicyLink,
      },
    ];

    const signOut = () => {
      saveDataLocal(ENTERED_INFORMATION_KEY, ENTERED_INFOMATION.noData);
      userStore.signOut();
      setTimeout(() => {
        rootNavigation.popToTop();
      }, 1000);
    };
    const goBack = () => {
      navigation.goBack();
    };

    function getLangOptions() {
      let optionTitles = langOptions.map(e => {
        return e.title;
      });
      optionTitles.push(langStore.currentLanguage.custom.cancel);
      return optionTitles;
    }

    return (
      <View style={styles.container}>
        <BaseHeader
          leftElement={<Image source={IC_BACK} style={styles.icon} />}
          leftAction={goBack}
          rightElement={null}
          centerElement={
            <Text style={commonStyles.headerTitle}>
              {currentLanguage.setting.title}
            </Text>
          }
        />
        <ScrollView style={{flexGrow: 1}}>
          <FlatList
            contentContainerStyle={styles.containerScroll}
            data={dataSetting}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ItemSetting item={item} />}
          />
          <TouchableOpacity style={styles.signOutContainer} onPress={signOut}>
            <Text style={styles.signOut}>
              {currentLanguage.setting.signOut}
            </Text>
            <Icon name="power-off" size={20} color="red" />
          </TouchableOpacity>
        </ScrollView>
        <ActionSheet
          ref={ref => (langActionSheet = ref)}
          title={currentLanguage.setting.dataLocale}
          options={getLangOptions()}
          cancelButtonIndex={langOptions.length}
          destructiveButtonIndex={currentLanguageIdx}
          onPress={index => {
            if (index < langOptions.length) {
              langStore.changeCurLanguage(langOptions[index].id);
            }
          }}
        />
      </View>
    );
  },
);

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
  },
  btnBack: {},
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.White,
  },
  containerScroll: {
    flexGrow: 1,
    backgroundColor: AppStyle.Color.White,
    paddingTop: 16,
  },
  titleInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  itemSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  itemSettingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  signOutContainer: {
    width: AppStyle.Screen.FullWidth,
    padding: 24,
    paddingBottom: 70,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signOut: {
    fontSize: 14,
    marginRight: 24,
    fontWeight: 'bold',
  },
});
