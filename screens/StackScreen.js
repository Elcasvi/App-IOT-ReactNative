import {FlatList, StyleSheet, Text, View} from "react-native";
import {DUMMY_DATA} from "../data/dummy";
import {useEffect, useState} from "react";
import firebaseDb from '../data/firebase'
import { getDatabase, ref, onValue} from "firebase/database";

export default function StackScreen()
{
    const db = firebaseDb
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
        //writeUserData("16","alberto","casvi","img")
        getData()
    },[]);
    function writeUserData(userId, name, email, imageUrl) {
        set(ref(db), {
            username: name,
            email: email,
            profile_picture: imageUrl
        }) ;
    }
const getData=async()=>
{
    const starCountRef = ref(db);
    await onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        console.log(typeof data)
        setDataDb(data)
    });
}


    return(
        <View style={styles.container}>

            <Text style={styles.myText}>Hello from Stack</Text>
            <View style={{paddingTop: 20}}>
            {
                dataDb===null?<Text>...</Text>:
                    <View>
                        <Text>{dataDb.email}</Text>
                        <Text>{dataDb.profile_picture}</Text>
                        <Text>{dataDb.username}</Text>
                    </View>
                    /*
                    dataDb.map((item)=>
                        <View key={item.email} style={{padding: 10}}>
                            {<Text>{item.email}</Text>}
                            {<Text>{item.profile_picture}</Text>}
                            {<Text>{item.username}</Text>}
                        </View>)
                     */

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