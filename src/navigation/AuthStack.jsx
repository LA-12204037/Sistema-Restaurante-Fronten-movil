import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/screens/LoginScreen.jsx";
import RegisterScreen from "../features/auth/screens/RegisterScreen.jsx";
import VerifyLoginScreen from "../features/auth/screens/VerifyLoginScreen.jsx";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyLogin" component={VerifyLoginScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;