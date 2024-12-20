import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native';

type BaseTextInputProps = {
  modifierStyle?: any;
  placeHolder?: string;
  keyboardType?: string;
  onText: (value: string) => void;
  defaultValue?: string;
};

const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
    />
  );
};

const BaseTextInput = ({
  modifierStyle,
  placeHolder,
  keyboardType,
  onText,
  defaultValue,
}: BaseTextInputProps) => {
  const [value, onChangeText] = React.useState(defaultValue);

  return (
    <View style={[styles.container, modifierStyle]}>
      <UselessTextInput
        style={[modifierStyle, {width: '100%'}]}
        multiline
        numberOfLines={1}
        onChangeText={(text) => {
          onChangeText(text);
          onText(text);
        }}
        value={value}
        placeholder={placeHolder}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default BaseTextInput;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000000',
    borderBottomWidth: 0.5,
  },
});
