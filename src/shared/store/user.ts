import {makeAutoObservable} from 'mobx';
import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
import UIStore from './ui';

export type User = {
  uid: string;
  displayName: string;
  photoURL: string;
};

export default class UserStore {
  user: User | null = null;
  email = '';
  password = '';
  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this.user = user;
  }

  setEmail = (val: string) => {
    this.email = val;
  };

  setPassword = (val: string) => {
    this.password = val;
  };

  signInAnonymous = (uiStore: UIStore) => {
    uiStore.showLoading('login');
    auth()
      .signInAnonymously()
      .then(() => {
        uiStore.hideLoading('login');
        console.log('User signed in anonymously');
      })
      .catch(error => {
        uiStore.hideLoading('login');
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error(error);
      });
  };

  signInWithEmail = (uiStore: UIStore) => {
    console.log('signInWithEmail: ', this.email, this.password);
    uiStore.showLoading('login');
    auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.resetData();
        console.log('User account created & signed in!');
        uiStore.hideLoading('login');
      })
      .catch(error => {
        uiStore.hideLoading('login');
        if (error.code === 'auth/user-not-found') {
          Alert.alert(
            'Error',
            'There is no user record corresponding to this identifier!',
          );
        }
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'That password is invalid!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        }

        console.error(error);
      });
  };

  signUpWithEmail = (uiStore: UIStore) => {
    uiStore.showLoading('login');
    auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.resetData();
        uiStore.hideLoading('login');
        Alert.alert('Success', 'User account created!');
        console.log('User account created & signed in!');
      })
      .catch(error => {
        uiStore.hideLoading('login');
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        }

        if (error.code === 'auth/weak-password') {
          Alert.alert('Error', 'The password is not strong enough!');
        }

        console.error(error);
      });
  };

  signInApple = async (uiStore: UIStore) => {
    console.log('signInApple');
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log(
      'signInApple identityToken: ',
      appleAuthRequestResponse.identityToken,
    );

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    console.log('signInApple appleCredential: ', appleCredential);
    // Sign the user in with the credential
    uiStore.showLoading('login');
    auth()
      .signInWithCredential(appleCredential)
      .then(() => {
        uiStore.hideLoading('login');
      })
      .catch(error => {
        uiStore.hideLoading('login');
        if (error.code === 'auth/account-exists-with-different-credential') {
          Alert.alert(
            'Error',
            'This account has email address is already used by other account!',
          );
        }
      });
  };

  signInGoogle = async (uiStore: UIStore) => {
    console.log('signInGoogle: start');

    try {
      const response = await GoogleSignin.signIn();

      // Create a Google credential with the token
      console.log('signInGoogle: ', response);

      const googleCredential = auth.GoogleAuthProvider.credential(
        response.data?.idToken + '',
      );
      console.log('googleCredential: ', googleCredential);

      // Sign-in the user with the credential
      uiStore.showLoading('login');
      auth()
        .signInWithCredential(googleCredential)
        .then(() => {
          uiStore.hideLoading('login');
        })
        .catch(error => {
          console.log('error: ', error);

          uiStore.hideLoading('login');
          if (error.code === 'auth/account-exists-with-different-credential') {
            Alert.alert(
              'Error',
              'This account has email address is already used by other account!',
            );
          }
        });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  signOut = () => {
    auth()
      .signOut()
      .then(() => {
        try {
          GoogleSignin.signOut();
        } catch (error) {}
        console.log('User signed out!');
      });
  };

  resetData = () => {
    this.email = '';
    this.password = '';
  };
}
