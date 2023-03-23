import {FlatList,Switch, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import firebaseDb from '../data/firebase'
import { getDatabase, ref, onValue,set,update} from "firebase/database";
import Card from './Card'

export default function StackScreen()
{
    const db = firebaseDb
    const on=100
    const off=0
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
    const [isEnabledDHT11, setIsEnabledDHT11] = useState(false);
    const [isEnabledRedLight, setIsEnabledRedLight] = useState(false);
    const [isEnabledSem, setIsEnabledSem] = useState(false);

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

         
    useEffect(()=>{
        if(isEnabledDHT11)
        {
            console.log("Dentro de enabled")
            activateDTH11(off)
        }
        else{
            console.log("Dentro de disable")
            activateDTH11(on)            
        }
    },[isEnabledDHT11])

    useEffect(()=>{
        if(isEnabledRedLight)
        {
            console.log("Dentro de enabled")
            activateRedLigth(on)
        }
        else{
            console.log("Dentro de disable")
            activateRedLigth(off)
        }
            
    },[isEnabledRedLight])

    useEffect(()=>{
        if(isEnabledSem)
        {
            console.log("Dentro de enabled")
            activateSem(30)
        }
        else{
            console.log("Dentro de disable")
            activateSem(off)
        }
            
    },[isEnabledSem])
    



 // value: 0 prendido, 100 apagado, ventilador
    function activateDTH11(value) {
        console.log("Dentro de la funcion", value);
        update(ref(db,'Limites/'), {Calor: value});
    }


// value: 100 prendido, 0 apagado, alarma
    function activateRedLigth(value) {
        update(ref(db,'Limites/'), {Oscuridad: value});
    }
    
    // VALUE: 30 se enciende, 0 apagado, el semaforo
    function activateSem(value) {
        update(ref(db,'Limites/'), {Lejania: value});
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

    const toggleSwitchDht11 = () => setIsEnabledDHT11(previousState => !previousState);
    const toggleSwitchRedLight = () => setIsEnabledRedLight(previousState => !previousState);
    const toggleSwitchSem = () => setIsEnabledSem(previousState => !previousState);
    




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
                                    thumbColor={setIsEnabledDHT11 ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitchDht11}
                                    value={isEnabledDHT11}
                                />
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
                            <View style={styles.container}>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={isEnabledSem ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitchSem}
                                    value={isEnabledSem}
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
                            <View style={styles.container}>
                                <Switch
                                    trackColor={{false: '#767577', true: '#81b0ff'}}
                                    thumbColor={isEnabledRedLight ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitchRedLight}
                                    value={isEnabledRedLight}
                                />
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