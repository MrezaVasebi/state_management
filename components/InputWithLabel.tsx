import React from "react";
import { StyleSheet, TextInputProps, TextStyle, View } from "react-native";
import AppInput from "./AppInput";

interface IInputWithLabel {
  label: string;
  lblStyle?: object;
  inputStyle?: object;
  rootStyle?: object;
}

const InputWithLabel = (
  props: IInputWithLabel & TextStyle & TextInputProps
) => {
  return (
    <View style={{ ...styles.rootStyle, ...props.rootStyle }}>
      {/* <AppText
        label={props.label}
        lblStyle={{ ...styles.lblStyle, ...props.lblStyle }}
      /> */}

      <AppInput
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        value={props.value}
        inputStyle={{ ...props.inputStyle }}
      />
    </View>
  );
};

export default InputWithLabel;

const styles = StyleSheet.create({
  rootStyle: {},
  lblStyle: {
    marginBottom: 5,
  },
});
