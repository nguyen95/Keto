import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {} from '../../../utils/icons';
import AppStyle from '../styles/app.style';

type AuthButtonProps = {
  containerStyle?: StyleProp<any>;
  iconStyle?: StyleProp<any>;
  titleStyle?: StyleProp<any>;
  icon?: any;
  title?: string;
  action: () => void;
};

const AuthButton: React.FC<AuthButtonProps> = ({
  containerStyle,
  iconStyle,
  titleStyle,
  icon,
  title,
  action,
}: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={action}>
      {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: AppStyle.Screen.FullWidth - 96,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
  },
  icon: {
    width: 32,
    height: 32,
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
    fontSize: AppStyle.Text.Normal,
    alignSelf: 'center',
    marginLeft: 16,
  },
});
