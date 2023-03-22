import {Button, StyleSheet, Text, View, FlatList, TouchableOpacity} from "react-native";
import{useNavigation} from "@react-navigation/native";

export default function HomeScreen()
{
    const navigation=useNavigation();
    return(
        <View style={styles.container}>
            <Text style={{fontSize: 30}}>Hello from Home</Text>
            <TouchableOpacity style={styles.myBtn} onPress={()=>navigation.navigate("Stack")}>
                <Text style={{color:"#fff"}}>Go to Stack Screen</Text>
            </TouchableOpacity>
        </View>
    )

}
const styles=StyleSheet.create({
    container:{
        paddingTop:"20%",
        alignItems:"center"
    },
    myBtn:{
        backgroundColor:"purple",
        padding:10,
        marginTop:"20%",
        width:"50%",
        alignItems:"center",
        borderRadius:35,
    }
})