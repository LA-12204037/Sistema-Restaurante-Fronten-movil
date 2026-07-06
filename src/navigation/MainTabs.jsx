import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, FONT_SIZE } from "../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

// Screen imports
import MenuScreen from "../features/menu/screens/MenuScreen.jsx";
import MenuDetailScreen from "../features/menu/screens/MenuDetailScreen.jsx";
import CartScreen from "../features/cart/screens/CartScreen.jsx";
import EventScreen from "../features/event/screens/EventScreen.jsx";
import ProfileScreen from "../features/profile/screens/ProfileScreen.jsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MenuStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.primary, // Color de títulos y flecha de regreso
            headerTitleStyle: { fontWeight: "bold" },
        }}
    >
        <Stack.Screen name="MenuList" component={MenuScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="MenuDetail" component={MenuDetailScreen} options={{ title: "Detalle del Platillo" }} />
    </Stack.Navigator>
);

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Ocultamos header de tabs, usamos el del stack para Menú
                headerStyle: { backgroundColor: COLORS.surface },
                headerTintColor: COLORS.primary,
                headerTitleStyle: { fontWeight: "bold" },
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
                        Menu: "restaurant-menu",
                        Cart: "shopping-cart",
                        Events: "event",
                        Profile: "person",
                    };
                    return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Menu" component={MenuStack} options={{ title: "Menú" }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: "Carrito", headerShown: true }} />
            <Tab.Screen name="Events" component={EventScreen} options={{ title: "Eventos", headerShown: true }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil", headerShown: true }} />
        </Tab.Navigator>
    );
};

export default MainTabs;