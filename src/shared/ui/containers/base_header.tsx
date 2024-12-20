import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AppStyle from '../styles/app.style';
import {heightHeader} from '../styles/common.style';

type BaseHeaderProps = {
  leftElement: any;
  rightElement: any;
  centerElement: any;
  leftAction?: () => void;
  rightAction?: () => void;
  centerAction?: () => void;
};

const BaseHeader: React.FC<BaseHeaderProps> = ({
  leftElement,
  rightElement,
  centerElement,
  leftAction,
  rightAction,
  centerAction,
}: BaseHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={leftAction}
          style={styles.buttonLeft}
          activeOpacity={0.1}>
          {leftElement}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={centerAction}
          style={styles.button}
          activeOpacity={0.1}>
          {centerElement}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={rightAction}
          style={styles.buttonRight}
          activeOpacity={0.1}>
          {rightElement}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BaseHeader;

const styles = StyleSheet.create({
  container: {
    height: heightHeader,
    width: '100%',
    backgroundColor: AppStyle.Color.Main,
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonLeft: {
    position: 'absolute',
    height: 64,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonRight: {
    position: 'absolute',
    height: 64,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
