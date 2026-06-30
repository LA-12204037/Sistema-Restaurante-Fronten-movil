import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, FONT_SIZE } from "../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import FieldsScreen from "../features/fields/screens/FieldsScreen.jsx";
import ProfileScreen from "../features/profile/screens/ProfileScreen.jsx";
import FieldDetailScreen from "../features/fields/screens/FieldDetailScreen.jsx";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const FieldsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.primary, // Color de títulos y flecha de regreso
            headerTitleStyle: { fontWeight: "bold" },
        }}
    >
        <Stack.Screen name="FieldsList" component={FieldsScreen} options={{ title: "Canchas" }} />
        <Stack.Screen name="FieldDetail" component={FieldDetailScreen} options={{ title: "Detalle" }} />
    </Stack.Navigator>
);

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Ocultamos header de tabs, usamos el del stack
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 65, // Un poco más alto para mejorar el toque en Android
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontWeight: "600" },
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Fields: "sports-soccer",
                        Profile: "person",
                    };
                    return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Fields" component={FieldsStack} options={{ title: "Canchas" }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
        </Tab.Navigator>
    );
};

export default MainTabs;