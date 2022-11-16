import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import {UserContextProvider, useUserContext} from "./context/userContext";
import Register from "./screens/Register";
import EmailVerification from "./screens/EmailVerification";
import Home from "./screens/Home"

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <UserContextProvider>
                <Stack.Navigator initialRouteName={"Landing"}>
                    <Stack.Screen name={"Landing"} component={Landing} options={{headerShown: false}}/>
                    <Stack.Screen name={"Login"} component={Login} options={{headerShown: false}}/>
                    <Stack.Screen name={"Register"} component={Register} options={{headerShown: false}}/>
                    <Stack.Screen name={"EmailVerification"} component={EmailVerification} options={{headerShown: false}}/>
                    <Stack.Screen name={"Home"} component={Home} options={{headerShown: false}}/>
                </Stack.Navigator>
            </UserContextProvider>
        </NavigationContainer>
    )
}