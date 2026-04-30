// BizMentor AI — Frontend Mobile (React Native)
// Compatible iOS & Android

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  SafeAreaView, StatusBar
} from 'react-native';
import { useBizMentor } from '../shared/useBizMentor';

const QUICK_SUGGESTIONS = [
  'Subsides Bruxelles ?',
  'Créer une SRL ?',
  'Business plan',
  'Optimiser TVA',
];

export default function ChatScreen({ userProfile }) {
  const { messages, loading, error, sendMessage, clearChat } = useBizMentor(userProfile);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const renderMessage = ({ item, index }) => (
    <View style={[styles.messageRow, item.role === 'user' && styles.userRow]}>
      <View style={[styles.avatar, item.role === 'user' ? styles.userAvatar : styles.aiAvatar]}>
        <Text style={[styles.avatarText, item.role === 'user' ? styles.userAvatarText : styles.aiAvatarText]}>
          {item.role === 'assistant' ? 'AI' : 'Vous'}
        </Text>
      </View>
      <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <>
      {loading && (
        <View style={styles.messageRow}>
          <View style={[styles.avatar, styles.aiAvatar]}>
            <Text style={styles.aiAvatarText}>AI</Text>
          </View>
          <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
            <ActivityIndicator size="small" color="#0F6E56" />
          </View>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {messages.length === 1 && !loading && (
        <View style={styles.suggestionsContainer}>
          {QUICK_SUGGESTIONS.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionChip}
              onPress={() => sendMessage(s)}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.headerTitle}>BizMentor AI</Text>
            <Text style={styles.headerSub}>Conseiller business belge</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Effacer</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.messagesList}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Votre question business..."
            placeholderTextColor="#aaa"
            multiline
            maxLength={500}
            editable={!loading}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#e8e8e5',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1D9E75' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  headerSub: { fontSize: 11, color: '#888', marginTop: 1 },
  clearBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#e8e8e5', borderRadius: 8,
  },
  clearBtnText: { fontSize: 12, color: '#888' },

  // Messages
  messagesList: { paddingHorizontal: 16, paddingVertical: 20, gap: 16 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 },
  userRow: { flexDirection: 'row-reverse' },

  avatar: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  aiAvatar: { backgroundColor: '#E1F5EE' },
  userAvatar: { backgroundColor: '#EEEDFE' },
  avatarText: { fontSize: 10, fontWeight: '600' },
  aiAvatarText: { color: '#0F6E56' },
  userAvatarText: { color: '#534AB7' },

  bubble: {
    maxWidth: '75%', padding: 12, borderRadius: 12,
  },
  aiBubble: {
    backgroundColor: '#f5f5f0',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#EEEDFE',
    borderTopRightRadius: 4,
  },
  typingBubble: { paddingVertical: 14, paddingHorizontal: 16 },
  bubbleText: { fontSize: 14, lineHeight: 22, color: '#1a1a1a' },
  userBubbleText: { color: '#2a2060' },

  // Suggestions
  suggestionsContainer: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingLeft: 38
  },
  suggestionChip: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e8e8e5',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  suggestionText: { fontSize: 13, color: '#555' },

  errorText: {
    fontSize: 13, color: '#c0392b', textAlign: 'center',
    margin: 8, padding: 8, backgroundColor: '#fdf0ef', borderRadius: 8,
  },

  // Input
  inputArea: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#e8e8e5', backgroundColor: '#fff',
  },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    fontSize: 14, color: '#1a1a1a',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#f9f9f7',
    borderWidth: 1, borderColor: '#e8e8e5', borderRadius: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  sendButton: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: '#534AB7',
    alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#ccc' },
  sendButtonText: { color: '#fff', fontSize: 20, fontWeight: '600' },
});
