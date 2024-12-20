import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import AppStyle from '../../../../shared/ui/styles/app.style';
import {APP_NAME} from '../../../../utils/config/setting';
import {IC_RIGHT_ARROW, LOGO_APP} from '../../../../utils/icons';

type IntroAppItemProps = {
  onPress: () => void;
  modifierStyle?: any;
};

const IntroAppItem: React.FC<IntroAppItemProps> = ({
  onPress,
  modifierStyle,
}: IntroAppItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, modifierStyle]}
      onPress={onPress}>
      <Image source={LOGO_APP} style={styles.logo} />
      <View style={styles.content}>
        <Text style={styles.continueTitle}>Continue to application</Text>
        <Text style={styles.appTitle}>{APP_NAME}</Text>
      </View>
      <Image source={IC_RIGHT_ARROW} style={styles.iconSmall} />
    </TouchableOpacity>
  );
};

export default IntroAppItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
  },
  content: {
    width: '70%',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconSmall: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 0,
  },
  continueTitle: {
    fontSize: AppStyle.Text.Small,
  },
  appTitle: {
    fontSize: AppStyle.Text.Medium,
    fontWeight: '600',
  },
});
