import {Platform} from 'react-native';
import {
  observable,
  action,
  flow,
  autorun,
  computed,
  makeAutoObservable,
} from 'mobx';
import CodePushDeploymentInfo from '../../../codepush.json';
import CodePush from 'react-native-code-push';
import {getDataLocal, saveDataLocal} from '../../services/storage';

export enum DeployEnviroment {
  Production = 'Production',
  Staging = 'Staging',
}

const codePushKey = 'CODE_PUSH_KEY';
const codePushEnvironment = 'CODE_PUSH_ENVIRONMENT';

export default class CodePushStore {
  //for codepush
  listDeployment: string[] = Object.keys(DeployEnviroment).map(
    e => DeployEnviroment[e],
  );
  deployEnviroment: string = DeployEnviroment.Production;
  status: string = 'loading';
  nowKey: string =
    Platform.OS === 'ios'
      ? CodePushDeploymentInfo.ios[this.deployEnviroment]
      : CodePushDeploymentInfo.android[this.deployEnviroment];

  listener: any = null;
  about: string = 'Product version 1.0.0';

  constructor() {
    makeAutoObservable(this);
    console.log('start code push', CodePush);
  }

  saveData = () => {
    saveDataLocal(codePushKey, this.nowKey);
    saveDataLocal(codePushEnvironment, this.deployEnviroment);
  };

  getData = async () => {
    let nowKey = await getDataLocal(codePushKey);
    let deployEnviroment = await getDataLocal(codePushEnvironment);
    if (nowKey !== '') this.nowKey = nowKey;
    if (deployEnviroment !== '') this.deployEnviroment = deployEnviroment;
  };

  setListener = async (listener: any) => {
    this.listener = listener;
  };

  get deploymentKey() {
    return this.nowKey;
  }

  get deployment() {
    return this.deployEnviroment;
  }

  changeDeployEnvirmonent = (deployment: string) => {
    if (deployment === this.deployEnviroment) return;
    this.deployEnviroment = deployment;
    this.nowKey =
      Platform.OS === 'ios'
        ? CodePushDeploymentInfo.ios[this.deployEnviroment]
        : CodePushDeploymentInfo.android[this.deployEnviroment];
    this.saveData();
    if (this.listener) {
      setTimeout(() => {
        this.listener();
      }, 1000);
    }
  };

  start = async () => {
    this.status = 'running';
    await this.getData();
    autorun(async () => {
      if (this.listener) {
        setTimeout(() => {
          this.listener();
        }, 1000);
      }
    });
  };
}
