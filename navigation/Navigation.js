import React from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import{createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import{createStackNavigator} from "@react-navigation/stack";

import {NavigationContainer} from "@react-navigation/native";

//Screens
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";


const HomeStackNavigator=createStackNavigator();
const Tab=createBottomTabNavigator();

const MyStack=()=>
{
    return(
        <HomeStackNavigator.Navigator>
            <HomeStackNavigator.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <HomeStackNavigator.Screen name="Stack" component={SettingScreen} options={{headerBackTitleVisible:false}}/>
        </HomeStackNavigator.Navigator>
    );
}

const MyTabs=()=>
{
    return(
        <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: 'black'
        }}>
            <Tab.Screen name="Home" component={MyStack}
                        options={{
                            tabBarLabel:'Home',
                            tabBarIcon:({color,size})=>(
                                <MaterialCommunityIcons name="home" color={color} size={30}/>
                            ),
                            tabBarBadge:10,
                            headerShown:false
            }}/>

            <Tab.Screen name="Setting" component={SettingScreen}
                        options={{
                            tabBarLabel:'Settings',
                            tabBarIcon:({color,size})=>(
                                <MaterialCommunityIcons name="brightness-5" color={color} size={30}/>
                            ),
                            //tabBarBadge:10,
                            headerShown:false
                        }}/>

        </Tab.Navigator>
    );
}

export default function Navigation()
{
   return(
       <NavigationContainer>
           <MyTabs/>
       </NavigationContainer>
   )
}
