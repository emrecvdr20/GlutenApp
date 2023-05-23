import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "../screens/ChatsScreen/ChatsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import ProductsSearch from "../screens/ProductsSearch";
import ProducList from "../screens/ProductList";
import Scanner from "../screens/Scanner";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarStyle: { backgroundColor: "whitesmoke" },
        headerStyle: { backgroundColor: "whitesmoke" },
        tabBarLabelStyle: {
          width: "100%"
        },
      }}
    >

      <Tab.Screen
        name="Search"
        component={ProductsSearch}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="List"
        component={ProducList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />


      <Tab.Screen
        name="Scan"
        component={Scanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-scan" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-chatbubbles-sharp" size={size} color={color} />
          ),
          headerRight: () => (
            <Entypo
              onPress={() => navigation.navigate("Contacts")}
              name="new-message"
              size={18}
              color={"royalblue"}
              style={{ marginRight: 15 }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Exit"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-exit" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;