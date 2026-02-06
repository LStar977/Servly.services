import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EmptyState } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { demoAPI } from '../../mock/api';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { MessagesStackParamList, Conversation } from '../../types';
import { formatDistanceToNow } from 'date-fns';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ConversationsList'>;

export function ConversationsListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await demoAPI.messages.getConversations(user.id);
    setConversations(data);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const getOtherParticipant = (conv: Conversation) => {
    const idx = conv.participantIds.indexOf(user?.id ?? '');
    const otherIdx = idx === 0 ? 1 : 0;
    return conv.participantNames[otherIdx] || 'Unknown';
  };

  return (
    <FlatList
      style={styles.container}
      data={conversations}
      keyExtractor={item => item.id}
      contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
      }
      renderItem={({ item }) => {
        const name = getOtherParticipant(item);
        return (
          <TouchableOpacity
            style={styles.conversationRow}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('Chat', {
                conversationId: item.id,
                participantName: name,
              })
            }>
            <View style={styles.avatar}>
              <Icon name="user" size={18} color={colors.primary[400]} />
            </View>
            <View style={styles.convInfo}>
              <View style={styles.convHeader}>
                <Text style={styles.convName}>{name}</Text>
                <Text style={styles.convTime}>
                  {formatDistanceToNow(new Date(item.lastMessageAt), { addSuffix: true })}
                </Text>
              </View>
              <View style={styles.convFooter}>
                <Text style={[styles.convMessage, item.unreadCount > 0 && styles.convMessageUnread]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <EmptyState
          icon="comments-o"
          title="No messages"
          message="When you message a provider, your conversations will appear here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  convInfo: {
    flex: 1,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  convName: {
    ...typography.label,
    color: colors.text,
  },
  convTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  convFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  convMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  convMessageUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  unreadText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
});
