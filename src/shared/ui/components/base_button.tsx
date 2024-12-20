import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IC_VIP} from '../../../utils/icons';
import AppStyle from '../styles/app.style';

type BaseButtonProps = {
  containerStyle?: StyleProp<any>;
  iconStyle?: StyleProp<any>;
  titleStyle?: StyleProp<any>;
  icon?: any;
  title?: string;
  vipRequire?: boolean;
  action: () => void;
};

const BaseButton: React.FC<BaseButtonProps> = ({
  containerStyle,
  iconStyle,
  titleStyle,
  icon,
  title,
  vipRequire,
  action,
}: BaseButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={action}>
      <Image source={icon} style={[styles.icon, iconStyle]} />
      <Text style={[styles.text, titleStyle]}>{title}</Text>
      {vipRequire && (
        <View style={styles.vipIconContainer}>
          <Image source={IC_VIP} style={styles.iconVip} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BaseButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  vipIconContainer: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
  iconVip: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  text: {
    fontSize: AppStyle.Text.Min,
    alignSelf: 'center',
    paddingTop: 5,
  },
});
