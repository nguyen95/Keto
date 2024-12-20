import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
} from 'mobx';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class UIStore {
  protected loadingIds: Array<String> = [];
  protected loadingMess: string = 'Loading...';
  protected toast: Toast | null = null;
  protected curNav: any = null;
  isShowMealSelectionBtn: boolean = false;
  codepushLoaded: boolean = false;
  showNativeAds: boolean = true;
  tabClickedCount: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  hideNativeAds = () => {
    this.showNativeAds = false;
  };

  setShowNativeAds = (val: boolean) => {
    this.showNativeAds = val;
  };

  setToast = (ref: Toast) => {
    this.toast = ref;
  };

  setCurNav = (navigation: any) => {
    this.curNav = navigation;
  };

  showToast = (mess: string) => {
    this.toast?.show(mess, 500);
  };

  showLoading(loadingId: string, mess?: string) {
    this.loadingIds.push(loadingId);
    if (mess) {
      this.loadingMess = mess;
    } else {
      this.loadingMess = 'Loading...';
    }
  }

  hideLoading(loadingId?: string, moreAction?: () => void) {
    if (loadingId) {
      const index = this.loadingIds.indexOf(loadingId);
      if (index > -1) {
        this.loadingIds.splice(index, 1);
      }
    } else {
      this.loadingIds = [];
    }
    setTimeout(moreAction ? moreAction : () => {}, 200);
  }

  get shouldShowLoading() {
    return this.loadingIds.length > 0;
  }

  get curLoadingMess() {
    return !!this.loadingMess;
  }

  get curNavigation() {
    return this.curNav;
  }

  changeCodepushState(state: boolean) {
    this.codepushLoaded = state;
  }

  changeShowMealSelection(value: boolean) {
    this.isShowMealSelectionBtn = value;
  }

  changeNumTabClicked(value: number) {
    this.tabClickedCount = value;
  }
}
