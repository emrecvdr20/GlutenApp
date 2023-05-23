import { createChatRoom, createUserChatRoom } from '../../graphql/mutations'
import { getCommonChatRoomWithUser } from '../../services/chatRoomService';
import { Text, Image, StyleSheet, Pressable, View } from "react-native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs";

dayjs.extend(relativeTime)

const ContactListItem = ({ user }) => {

    const navigation = useNavigation();

    const onPress = async () => {

        const existingChatRoom = await getCommonChatRoomWithUser(user.id);
        if (existingChatRoom) {
            navigation.navigate("Chat", { id: existingChatRoom.id });
            return;
        }

        const newChatRoomData = await API.graphql(
            graphqlOperation(createChatRoom, { input: {} })
        )

        if (!newChatRoomData.data?.createChatRoom) {
            console.log("Error creating the chat error");
        }
        const newChatRoom = newChatRoomData.data?.createChatRoom;

        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomId: newChatRoom.id, userId: user.id },
            })
        );

        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(
            graphqlOperation(createUserChatRoom, {
                input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
            })
        );

        navigation.navigate("Chat", { id: newChatRoom.id });

    };

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image source={{ uri: user.image }} style={styles.image} />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name1}>{user.name}</Text>
                <Text numberOfLines={2} style={styles.subTitle}>{user.status}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    content: {
        flex: 1,
    },
    name1: {
        fontWeight: "bold"
    },
    subTitle: {
        color: 'gray'
    }
})

export default ContactListItem;