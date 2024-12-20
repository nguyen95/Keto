import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LanguageStore from '../../../shared/store/language';
import SubStore, {SUB_TYPE} from '../../../shared/store/sub';
import UIStore from '../../../shared/store/ui';
import BaseHeader from '../../../shared/ui/containers/base_header';
import AppStyle from '../../../shared/ui/styles/app.style';
import {commonStyles} from '../../../shared/ui/styles/common.style';
import {
  about_us_link,
  policy_link,
  SUBSCRIPTION_MONTH_PRICE,
} from '../../../utils/config/setting';
import {alertInfo} from '../../../utils/functions';
import {IC_BACK, IMG_SUB} from '../../../utils/icons';

type SubscriptionProps = {
  subStore: SubStore;
  uiStore: UIStore;
  langStore: LanguageStore;
  navigation: any;
  route: any;
  isModalShow?: boolean;
  dismissView?: () => void;
};

const SubscriptionScreen: React.FC<SubscriptionProps> = ({
  subStore,
  uiStore,
  langStore,
  navigation,
  route,
  isModalShow,
  dismissView,
}: SubscriptionProps) => {
  const {currentLanguage} = langStore;
  const actionAfterVip = route && route.params.actionAfterVip;
  const BENEFITS = [currentLanguage.sub.benefit1, currentLanguage.sub.benefit2];

  const onClickBuy = async () => {
    uiStore.showLoading('purchase');
    await subStore.getAvailablePurchases();
    if (subStore.isVip) {
      uiStore.hideLoading();
      alertInfo('', 'Restore purchase successfully!', false, () => {
        subStore.removeListener();
      });
    } else {
      await subStore.purchase(SUB_TYPE.MONTH);
      await subStore.getAvailablePurchases();
      uiStore.hideLoading();
      if (subStore.isVip) {
        if (!isModalShow) {
          navigation.goBack();
          actionAfterVip && actionAfterVip();
        } else {
          dismissView && dismissView();
        }
      }
    }
  };

  const restorePurchase = async () => {
    uiStore.showLoading('purchase');
    await subStore.getAvailablePurchases();
    uiStore.hideLoading();
    if (subStore.isVip) {
      if (!isModalShow) {
        navigation.goBack();
        actionAfterVip && actionAfterVip();
      } else {
        dismissView && dismissView();
      }
    }
  };

  const onClickTermLink = () => {
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

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={
          !isModalShow ? (
            <Image source={IC_BACK} style={styles.icon} />
          ) : (
            <Text style={styles.restoreText}>SKIP</Text>
          )
        }
        rightElement={
          <TouchableOpacity onPress={restorePurchase}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        }
        centerElement={
          <Text style={commonStyles.headerTitle}>
            {currentLanguage.sub.title}
          </Text>
        }
        leftAction={() => {
          if (!isModalShow) {
            navigation.goBack();
          } else {
            dismissView && dismissView();
          }
        }}
      />
      <ScrollView style={styles.container}>
        <Image source={IMG_SUB} style={styles.imageSub} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>
            {currentLanguage.sub.title + ' ' + 'Monthly'}
          </Text>
          <Text style={styles.subTitle}>{currentLanguage.sub.des}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subPrice}>$</Text>
            <Text style={styles.price}>{SUBSCRIPTION_MONTH_PRICE}</Text>
          </View>
          <Text style={[styles.subTitle, {paddingBottom: 24, paddingTop: 0}]}>
            {currentLanguage.sub.perMonth}
          </Text>
        </View>
        <View style={{paddingHorizontal: 32}}>
          {BENEFITS.map((text, index) => {
            return (
              <View key={`benefit-${index}`} style={styles.benefitContainer}>
                <View style={styles.point} />
                <Text style={styles.benefitText}>{text}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={styles.upgradeBtn} onPress={onClickBuy}>
          <Text style={styles.upgradeBtnText}>
            {currentLanguage.sub.upgrade}
          </Text>
        </TouchableOpacity>
        <Text style={styles.licenseText}>
          The subscription package 'Premium Monthly' at a price of 4.99$ is
          valid for a period of one month from the day of subscription. Payment
          will be debited to your iTunes account upon confirmation of purchase.
          The subscription will be renewed automatically unless you decide to
          stop it at least 24 hours before the date of automatic renewal.
          Account will be charged for renewal within 24-hours prior to the end
          of the current period. After your purchase you can manage your
          subscription at any time and turn off auto-renewal in the settings of
          your iTunes account.
        </Text>
        <View style={styles.termGroup}>
          <TouchableOpacity style={styles.termBtn} onPress={onClickTermLink}>
            <Text style={styles.termText}>{currentLanguage.sub.term}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.termBtn} onPress={onClickPolicyLink}>
            <Text style={styles.termText}>{currentLanguage.sub.policy}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.Color.White,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: AppStyle.Color.White,
  },
  imageSub: {
    width: Dimensions.get('window').width / 1.3,
    height: Dimensions.get('window').width / 1.3,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  title: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: AppStyle.Text.Large,
    fontWeight: '800',
    color: AppStyle.Color.DarkBlue,
  },
  subTitle: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: AppStyle.Text.Small,
    fontWeight: '800',
    color: AppStyle.Color.TabBarGray,
    paddingVertical: 8,
  },
  price: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: 30,
    fontWeight: '800',
    color: AppStyle.Color.Main,
    paddingVertical: 8,
  },
  subPrice: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: AppStyle.Text.Medium,
    fontWeight: '500',
    color: AppStyle.Color.Main,
    paddingVertical: 8,
  },
  benefitContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppStyle.Color.Main,
  },
  benefitText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: AppStyle.Text.Normal,
    fontWeight: '500',
    color: AppStyle.Color.DarkBlue,
    paddingHorizontal: 8,
  },
  upgradeBtn: {
    height: 40,
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: AppStyle.Color.Main,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  termBtn: {
    paddingBottom: 16,
  },
  termText: {
    fontSize: AppStyle.Text.Normal,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: AppStyle.Color.Main,
  },
  upgradeBtnText: {
    fontSize: AppStyle.Text.Medium,
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppStyle.Color.White,
  },
  restoreText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Hiragino Sans',
    fontSize: AppStyle.Text.Normal,
    fontWeight: '500',
    color: AppStyle.Color.White,
  },
  licenseText: {
    width: '100%',
    padding: 16,
    paddingBottom: 0,
    color: AppStyle.Color.TextGray,
    fontSize: AppStyle.Text.Normal,
    textAlign: 'justify',
    lineHeight: AppStyle.Text.Large,
  },
  termGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignSelf: 'center',
    paddingTop: 8,
    paddingBottom: 50,
  },
});

export default SubscriptionScreen;
