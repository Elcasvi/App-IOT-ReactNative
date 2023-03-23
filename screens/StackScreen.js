import {FlatList,Switch, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import firebaseDb from '../data/firebase'
import { getDatabase, ref, onValue,set} from "firebase/database";
import Card from './Card'

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
    const[dataDb,setDataDb]=useState([])
    const[dataDHT11,setDataDbDHT11]=useState(0)
    const[dataHC_SR04,setDataDbHC_SR04]=useState(0)
    const[dataLDR,setDataDbLDR]=useState(0)

    useEffect(() => {
        //writeUserData("2","0","2","1")
        getDataDHT11()
        getDataLDR()
        getDataHC_SR04()
    },[]);
    function writeUserData(id,distancia, iluminacion, temperatura) {
        set(ref(db,'PIR/'+id), {
            Id:id,
            Distancia: distancia,
            Iluminacion: iluminacion,
            Temperatura: temperatura
        }) ;
    }

const getDataDHT11=()=>
{
    const starCountRef = ref(db,'DHT11/');
     onValue(starCountRef, async (snapshot) => {
         const data = snapshot.val();
         const longitud = Object.keys(data).length;
         const val=Object.values(data)[longitud-1]
         console.log(Object.values(data)[longitud-1])
         setDataDbDHT11(val)

    });
}
    const getDataLDR=()=>
    {
        const starCountRef = ref(db,'LDR/');
        onValue(starCountRef, async (snapshot) => {
            const data = snapshot.val();
            const longitud = Object.keys(data).length;
            const val=Object.values(data)[longitud-1]
            console.log(Object.values(data)[longitud-1])
            setDataDbLDR(val)

        });
    }

    const getDataHC_SR04=()=>
    {
        const starCountRef = ref(db,'HC-SR04/');
        onValue(starCountRef, async (snapshot) => {
            const data = snapshot.val();
            const longitud = Object.keys(data).length;
            const val=Object.values(data)[longitud-1]
            console.log(Object.values(data)[longitud-1])
            setDataDbHC_SR04(val)
        });
    }

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);





    return(
        <View style={styles.container}>
            <Text style={styles.myText}>Mis sensores</Text>
            <View style={{paddingTop: 20}}>
                {
                    dataDHT11===0?<Text>...</Text>:
                        <View style={styles.cardParent}>
                            <View style={styles.card}>
                                <Text style={styles.titleCard}>DHT11</Text>
                                <Text>{dataDHT11}</Text>
                            </View>
                            <View style={styles.container}>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </View>
                        </View>
                }
                {
                    dataLDR===0?<Text>...</Text>:
                        <View style={styles.cardParent}>
                            <View style={styles.card}>
                                <Text style={styles.titleCard}>LDR</Text>
                                <Text>{dataLDR}</Text>
                            </View>
                        </View>
                }
                {
                    dataHC_SR04===0?<Text>...</Text>:
                        <View style={styles.cardParent}>
                            <View style={styles.card}>
                                <Text style={styles.titleCard}>HC_SR04</Text>
                                <Text>{dataHC_SR04}</Text>
                            </View>
                        </View>
                }
            </View>
        </View>
    )

}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#dcdcdc",
        paddingTop:"15%",
        paddingLeft:"10%",
        alignItems:"flex-start"
    },
    myText:{
        fontSize:30
    },
    cardParent:{
        flexDirection: "row",
    },
    card:{
        backgroundColor:"#fff",
        margin:5,
        padding:10,
        width:"50%",
        height:"75%",
        alignItems:"center",
        borderRadius:10
    },
    titleCard:{
        fontSize:15,
        fontWeight:"bold"
    },
    descriptionCard:{
        fontFamily:"Cochin"
    }
})