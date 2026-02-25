// ─────────────────────────────────────────────
//  ChatInventoryWindow
//  A scrollable chat card that lets users ask
//  questions about their inventory / spending.
//  Currently: bot echoes the user's message.
//  TODO: wire to backend AI service.
// ─────────────────────────────────────────────

import { SemanticTheme } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { s } from "./styles/ChatInventoryWindow.s";

type Role = "user" | "bot";

type Message = {
  id: string;
  role: Role;
  text: string;
};

type Props = {
  theme: SemanticTheme;
};

const HINTS = [
  "What did I spend most on?",
  "This week's total?",
  "Top category this month?",
  "Biggest single purchase?",
];

export function ChatInventoryWindow({ theme }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    // Echo reply — replace this with a real API call later
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      text,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setDraft("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          s.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {/* ── Header (tap to collapse) ── */}
        <Pressable style={s.header} onPress={() => setCollapsed((c) => !c)}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={15}
            color={theme.primary}
          />
          <Text style={[s.title, { color: theme.text }]}>
            Talk with your inventory
          </Text>
          <View
            style={[
              s.betaPill,
              {
                backgroundColor: theme.primaryDim + "22",
                borderColor: theme.primaryDim + "44",
              },
            ]}
          >
            <Text style={[s.betaText, { color: theme.primary }]}>beta</Text>
          </View>
          <View style={s.headerSpacer} />
          <Ionicons
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={14}
            color={theme.textMuted}
            style={s.chevron}
          />
        </Pressable>

        {/* ── Collapsible body ── */}
        {!collapsed && (
          <>
            {/* ── Message list ── */}
            <ScrollView
              ref={scrollRef}
              style={s.messagesContainer}
              contentContainerStyle={[
                s.messagesContent,
                messages.length === 0 && { flex: 1 },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 ? (
                <View style={s.emptyState}>
                  <Ionicons
                    name="sparkles-outline"
                    size={22}
                    color={theme.textMuted}
                  />
                  <Text style={[s.emptyText, { color: theme.textMuted }]}>
                    {"Ask me anything about your\nspending or inventory"}
                  </Text>
                  <View style={s.hintsRow}>
                    {HINTS.map((h) => (
                      <Pressable
                        key={h}
                        onPress={() => setDraft(h)}
                        style={({ pressed }) => [
                          s.hintChip,
                          {
                            backgroundColor: theme.primary + "15",
                            borderColor: theme.primary + "30",
                            opacity: pressed ? 0.65 : 1,
                          },
                        ]}
                      >
                        <Text style={[s.hintText, { color: theme.primary }]}>
                          {h}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <View
                      key={msg.id}
                      style={[
                        s.bubbleRow,
                        isUser ? s.bubbleRowUser : s.bubbleRowBot,
                      ]}
                    >
                      <View
                        style={[
                          s.bubble,
                          isUser
                            ? [s.bubbleUser, { backgroundColor: theme.primary }]
                            : [
                                s.bubbleBot,
                                {
                                  backgroundColor: theme.surfaceElevated,
                                  borderWidth: 1,
                                  borderColor: theme.border,
                                },
                              ],
                        ]}
                      >
                        <Text
                          style={[
                            s.bubbleText,
                            { color: isUser ? theme.textInverse : theme.text },
                          ]}
                        >
                          {msg.text}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* ── Input row ── */}
            <View style={s.inputRow}>
              <TextInput
                style={[
                  s.textInput,
                  {
                    backgroundColor: theme.surfaceInput,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Ask about your spending…"
                placeholderTextColor={theme.textMuted}
                value={draft}
                onChangeText={setDraft}
                multiline
                returnKeyType="send"
                blurOnSubmit
                onSubmitEditing={sendMessage}
              />
              <Pressable
                onPress={sendMessage}
                style={({ pressed }) => [
                  s.sendBtn,
                  {
                    backgroundColor: draft.trim()
                      ? theme.primary
                      : theme.surfaceElevated,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="arrow-up"
                  size={18}
                  color={draft.trim() ? theme.textInverse : theme.textMuted}
                />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
