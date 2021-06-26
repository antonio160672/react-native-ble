import React from 'react'
import {
    View,
    Text,
    Switch,
    StyleSheet
} from 'react-native'
function Togger(props) {
    return (
        <View
            style={styles.container}>
            <Text style={styles.title}>
                {props.value?'ON':'Off'}
            </Text>
            <Switch
                style={styles.swich}
                value={props.value}
                onValueChange={props.onValueChange}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingVertical:25,
        flexDirection:'row'

    },
    title: {
        marginLeft:10,
        fontSize:20,
        fontWeight:'bold',
        flex:1

    },
    Switch: {
        width:50

    },
})
export default Togger;