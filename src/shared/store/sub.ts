import {makeAutoObservable, runInAction} from 'mobx';
import {
  Alert,
  EmitterSubscription,
  Platform,
  PlatformColor,
} from 'react-native';
import * as RNIap from 'react-native-iap';
import {
  finishTransaction,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
} from 'react-native-iap';
import {
  SUBSCRIPTION_MONTH_ID_IOS,
  SUBSCRIPTION_MONTH_ID_ANDROID,
} from '../../utils/config/setting';

export enum SUB_TYPE {
  WEEK,
  MONTH,
  YEAR,
}

const itemSubs = Platform.select({
  android: [SUBSCRIPTION_MONTH_ID_ANDROID],
  ios: [SUBSCRIPTION_MONTH_ID_IOS],
});

const subMonth = Platform.select({
  android: SUBSCRIPTION_MONTH_ID_ANDROID,
  ios: SUBSCRIPTION_MONTH_ID_IOS,
});

export default class SubStore {
  isVip: boolean = false;
  arrPurchases: Array<RNIap.SubscriptionPurchase> = [];
  arrSubscriptions: Array<RNIap.Subscription> = [];
  purchaseUpdateSubscription: EmitterSubscription | null = null;
  purchaseErrorSubscription: EmitterSubscription | null = null;

  shoudShowView: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  hideView = () => {
    this.shoudShowView = false;
  };

  showView = () => {
    this.shoudShowView = true;
  };

  init = async () => {
    await RNIap.initConnection().then(() => {
      RNIap.flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {})
        .then(() => {
          this.purchaseUpdateSubscription = purchaseUpdatedListener(
            (purchase: SubscriptionPurchase) => {
              console.log('purchaseUpdatedListener', purchase);
              const receipt = purchase.transactionReceipt;
              if (receipt) {
                try {
                  this.isVip = true;
                  finishTransaction(purchase, false);
                } catch (ackErr) {
                  console.error('ackErr', ackErr);
                }
              }
            },
          );

          this.purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
              console.warn('purchaseErrorListener', error);
            },
          );
        });
    });

    try {
      if (itemSubs) {
        this.arrSubscriptions = await RNIap.getSubscriptions(itemSubs);
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  getAvailablePurchases = async () => {
    this.isVip = true;
    // try {
    //   this.arrPurchases = await RNIap.getAvailablePurchases();
    //   if (this.arrPurchases.length > 0) {
    //     this.arrPurchases.forEach((purchase) => {
    //       if (itemSubs?.includes(purchase.productId)) {
    //         this.isVip = true;
    //       } else {
    //         this.isVip = false;
    //       }
    //     });
    //   } else {
    //     this.isVip = false;
    //   }
    // } catch (err) {
    //   console.warn('restorePurchase Error', err);
    //   this.isVip = false;
    // }
  };

  purchase = async (sub_type: SUB_TYPE) => {
    try {
      if (sub_type === SUB_TYPE.MONTH && subMonth) {
        await RNIap.requestSubscription(subMonth);
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  getVipStatus = () => {
    return this.isVip;
  };

  removeListener = () => {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  };
}
