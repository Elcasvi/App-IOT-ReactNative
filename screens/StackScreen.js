import {FlatList, StyleSheet, Text, View} from "react-native";
import {DUMMY_DATA} from "../data/dummy";
import Card from "@react-navigation/stack/src/views/Stack/Card";
export default function StackScreen()
{
    //Iterar sobre una lista
    /*
    const renderItem=({item})=>
    {
        return<Text style={styles.myText}> {item.title}</Text>
    }
    <FlatList
        data={DUMMY_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
    />
    */

    const data=DUMMY_DATA

    return(
        <View style={styles.container}>
            <Text style={styles.myText}>Hello from Stack</Text>
            <View style={{paddingTop: 20}}>
            {
                data.map((item)=>
                    <View key={item} style={{padding: 10}}>
                        {<Text>{item.id}</Text>}
                        {<Text>{item.title}</Text>}
                        {<Text>{item.description}</Text>}
                    </View>
                )
            }
            </View>
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