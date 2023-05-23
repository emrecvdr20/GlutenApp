import { createChatRoom, createUserChatRoom } from "../graphql/mutations";
import { getCommonChatRoomWithUser } from "../services/chatRoomService";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { listUsers } from "../graphql/queries";
import { useState, useEffect } from "react";

const ContactsScreen = () => {
    const [users, setUsers] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items);
        });
    }, []);

    const createAChatRoomWithTheUser = async (user) => {

        const existingChatRoom = await getCommonChatRoomWithUser(user.id);
        if (existingChatRoom) {
            navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id });
            return;
        }


        const newChatRoomData = await API.graphql(
            graphqlOperation(createChatRoom, { input: {} })
        );
        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating the chat error");
        }
        const newChatRoom = newChatRoomData.data?.createChatRoom;


        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomID: newChatRoom.id, userID: user.id },
            })
        );


        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomID: newChatRoom.id, userID: authUser.attributes.sub },
            })
        );


        navigation.navigate("Chat", { id: newChatRoom.id });
    };

    return (
        <FlatList
            data={users}
            renderItem={({ item }) => (
                <ContactListItem
                    user={item}
                    onPress={() => createAChatRoomWithTheUser(item)}
                />
            )}
            style={{ backgroundColor: "white" }}
            ListHeaderComponent={() => (
                <Pressable
                    onPress={() => {
                        navigation.navigate("New Group");
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 15,
                        paddingHorizontal: 20,
                    }}
                >
                    <MaterialIcons
                        name="group"
                        size={24}
                        color="royalblue"
                        style={{
                            marginRight: 20,
                            backgroundColor: "gainsboro",
                            padding: 7,
                            borderRadius: 20,
                            overflow: "hidden",
                        }}
                    />
                    <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
                </Pressable>
            )}
        />
    );
};

export default ContactsScreen;