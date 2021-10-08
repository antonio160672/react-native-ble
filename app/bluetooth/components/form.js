import React from 'react'
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Button } from 'react-native-elements';

function Formulario(props) {
    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                placeholder="Nombre del experimento"
                keyboardType="default"
                onChangeText={props.onChangeText}
            />
            <Button
                buttonStyle={{
                    height: 50,
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: 220,
                    borderRadius:20,

                }}
                title="Guardar experimento"
                onPress={props.onPress}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})
export default Formulario;