import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { fetchFaqs } from '@/api/faqs';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

import { mockFaqs, type Faq } from './mockFaqs';

export function FaqsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  // Start with the bundled fallback so the screen never blank-flashes.
  // If Supabase has content, swap it in when the fetch resolves.
  const [faqs, setFaqs] = useState<Faq[]>(mockFaqs);

  useEffect(() => {
    let cancelled = false;
    fetchFaqs().then((remote) => {
      if (cancelled) return;
      if (remote.length > 0) setFaqs(remote);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <Screen>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search FAQs"
        placeholderTextColor={theme.colors.muted}
        style={styles.search}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No matches</Text>
          <Text style={styles.emptyBody}>
            Try different words, or email support@bidawash.com and we&apos;ll help.
          </Text>
        </View>
      ) : (
        filtered.map((faq) => {
          const isOpen = expanded === faq.id;
          return (
            <Card key={faq.id}>
              <Pressable
                onPress={() => setExpanded(isOpen ? null : faq.id)}
                style={styles.header}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={faq.question}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.chevron}>{isOpen ? '−' : '+'}</Text>
              </Pressable>
              {isOpen ? (
                <View style={styles.answerWrap}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              ) : null}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    fontSize: 15,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  question: { flex: 1, fontSize: 15, fontWeight: '600', color: theme.colors.text },
  chevron: { fontSize: 22, color: theme.colors.muted, paddingLeft: theme.spacing.md },
  answerWrap: { marginTop: theme.spacing.sm },
  answer: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
  emptyWrap: { padding: theme.spacing.lg, alignItems: 'center', gap: theme.spacing.xs },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  emptyBody: { fontSize: 13, color: theme.colors.muted, textAlign: 'center', lineHeight: 18 },
});
