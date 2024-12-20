/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import Share from 'react-native-share';
import {RNCamera} from 'react-native-camera';
import UserStore from './shared/store/user';

interface IState {
  imagePath: string | null;
  textString: string;
  // hue: number
  // blur: number
  // sepia: number
  // sharpen: number
  // negative: number
  // contrast: number
  // saturation: number
  // brightness: number
  // temperature: number
  // exposure: number
}

interface IProps {
  onClose: () => void;
  userStore: UserStore;
}

const message = 'Test cam';
const url = 'https://google.com.vn';
const title = 'Test cam title';
const config = {
  hue: 0,
  blur: 0,
  sepia: 0,
  sharpen: 2,
  negative: 0,
  contrast: 2,
  saturation: 2,
  brightness: 2,
  temperature: 4000,
  exposure: 1,
};

export default class AppTest extends Component<IProps, IState> {
  camera: RNCamera | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      imagePath: null,
      textString: '',
    };
  }

  takePicture = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.warn('takePicture ', data);
      this.setState({
        imagePath: data.uri,
      });
    }
  };

  saveAndshare = () => {
    const icon = `${this.state.imagePath}`;
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For using custom icon instead of default text icon at share preview when sharing with message.
            placeholderItem: {
              type: 'url',
              content: icon,
            },
            item: {
              default: {
                type: 'text',
                content: `${message} ${url}`,
              },
            },
            linkMetadata: {
              title: message,
              icon: icon,
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });
    Share.open(options);
  };

  myAsyncPDFFunction = async (name) => {
    try {
      const options = {
        imagePaths: [this.state.imagePath!.replace('file://', '')],
        name: name,
        maxSize: {
          // optional maximum image dimension - larger images will be resized
          width: 900,
          height: Math.round(
            (Dimensions.get('window').height /
              Dimensions.get('window').height) *
              900,
          ),
        },
        quality: 0.7, // optional compression paramter
      };

    } catch (e) {
      console.log(e);
      Alert.alert(
        'Error',
        `${e}`,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.imagePath ? (
          null
        ) : (
          <RNCamera
            style={{
              alignItems: 'center',
              height: '100%',
              alignSelf: 'center',
              backgroundColor: 'black',
              width: '100%',
            }}
            ref={(ref) => {
              this.camera = ref;
            }}
          />
        )}
        {!this.state.imagePath ? (
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: 'white',
              width: '100%',
              flexDirection: 'row',
              bottom: 0,
              position: 'absolute',
            }}>
            <TouchableOpacity style={styles.newPic} onPress={this.takePicture}>
              <Text>Take picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newPic}
              onPress={() => this.myAsyncPDFFunction('test.pdf')}>
              <Text>Convert to PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newPic}
              onPress={this.props.onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.newPic}
              onPress={() => {}}>
              <Text>ORC</Text>
            </TouchableOpacity>
            <Text>{this.state.textString}</Text>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  newPic: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    top: 20,
    bottom: 20,
    height: 40,
    width: 120,
    backgroundColor: '#FFF',
  },
  left: {
    left: 20,
  },
  right: {
    right: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  scanner: {
    flex: 1,
    width: 400,
    height: 200,
    borderColor: 'orange',
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
  },
});
