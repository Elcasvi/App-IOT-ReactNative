import {StyleSheet, Text, View} from "react-native";
export default function SettingScreen()
{
    return(
        <View style={styles.container}>
            <Text style={styles.myText}>Hello from Setting</Text>
        </View>
    )

}
const styles=StyleSheet.create({
    container:{
        paddingTop:"20%",
        alignItems:"center"
    },
    myText:{
        fontSize:30
    }
})