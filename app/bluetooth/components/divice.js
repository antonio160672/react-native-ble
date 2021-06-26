import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native'
import Separator from './separator'
function Divice(props) {
    
    return (
       <>
        <TouchableOpacity
            style={styles.wrapper}
            onPress={props.onPress}
        >
            <View
                style={styles.wrapperLeft}
            >
                <Image
                    style={styles.iconLeft}
                    source={props.iconLeft}
                />
            </View>
            <View
                style={styles.wrapperName}
            >
                <Text style={styles.Name}>
                    {props.deviceID}
                </Text>
            </View>
            <Image
                style={styles.iconRight}
                source={props.iconRight}
            />
        </TouchableOpacity>
        <Separator  />
        </>

    )
}
const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        justifyContent:'space-between'
    },
    wrapperLeft: {
        width:40,
        borderRadius:20,
        borderColor:'gray',
        borderWidth:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    iconLeft: {
        width:30,
        height:30
    },
    wrapperName: {
        flex:1,
        justifyContent:'flex-start',
        marginLeft:15
    },
    name: {
    },
    iconRight: {
        width:30,
        height:30
    },
})
export default Divice;