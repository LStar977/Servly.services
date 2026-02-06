import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../hooks/useAuth';
import { demoAPI } from '../../mock/api';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { MessagesStackParamList, Message } from '../../types';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<MessagesStackParamList, 'Chat'>;

export function ChatScreen({ route }: Props) {
  const { conversationId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    const data = await demoAPI.messages.getMessages(conversationId);
    setMessages(data);
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const text = input.trim();
    setInput('');

    // Find the other participant
    const otherMessage = messages.find(m => m.senderId !== user.id);
    const receiverId = otherMessage?.senderId ?? '';

    const newMsg = await demoAPI.messages.send({
      senderId: user.id,
      receiverId,
      conversationId,
      content: text,
    });

    setMessages(prev => [...prev, newMsg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const isMyMessage = (msg: Message) => msg.senderId === user?.id;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const mine = isMyMessage(item);
          return (
            <View style={[styles.messageBubbleRow, mine && styles.myMessageRow]}>
              <View style={[styles.bubble, mine ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.messageText, mine && styles.myMessageText]}>
                  {item.content}
                </Text>
                <Text style={[styles.messageTime, mine && styles.myMessageTime]}>
                  {format(new Date(item.createdAt), 'h:mm a')}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}>
          <Icon name="send" size={16} color={input.trim() ? colors.white : colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: spacing.base,
    paddingBottom: spacing.sm,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  myBubble: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  messageText: {
    ...typography.body,
    color: colors.text,
  },
  myMessageText: {
    color: colors.white,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 4,
    fontSize: 10,
  },
  myMessageTime: {
    color: colors.primary[200],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    paddingBottom: spacing.base,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
});
