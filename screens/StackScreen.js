import {FlatList, StyleSheet, Text, View} from "react-native";
import {DUMMY_DATA} from "../data/dummy";
import {useEffect, useState} from "react";
import firebaseDb from '../data/firebase'
import { getDatabase, ref, set } from "firebase/database";
export default function StackScreen()
{

    //Iterar sobre una lista
    /*
    const renderItem=({item})=>
    {
        return<Text style={styles.myText}> {item.title}</Text>
    }
    <FlatListS
        data={DUMMY_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
    />
    */


    const[dataDb,setDataDb]=useState(null);
    useEffect(() => {
        console.log("Fire base data ---------------------------")
        console.log(firebaseDb)
        writeUserData("1","carlos","casvi","img")
    },[]);
    function writeUserData(userId, name, email, imageUrl) {
        const db = getDatabase();
        set(ref(db, 'users/' + userId), {
            username: name,
            email: email,
            profile_picture: imageUrl
        }) ;
    }



    return(
        <View style={styles.container}>
            <Text style={styles.myText}>Hello from Stack</Text>
            <View style={{paddingTop: 20}}>
            {

                DUMMY_DATA.map((item)=>
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