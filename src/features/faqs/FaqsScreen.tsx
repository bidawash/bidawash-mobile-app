import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { theme } from '@/theme';

import { mockFaqs } from './mockFaqs';

export function FaqsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Screen>
      <Text style={styles.intro}>Tap a question to expand the answer.</Text>
      {mockFaqs.map((faq) => {
        const isOpen = expanded === faq.id;
        return (
          <Card key={faq.id}>
            <Pressable onPress={() => setExpanded(isOpen ? null : faq.id)} style={styles.header}>
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
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, color: theme.colors.muted },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  question: { flex: 1, fontSize: 15, fontWeight: '600', color: theme.colors.text },
  chevron: { fontSize: 22, color: theme.colors.muted, paddingLeft: theme.spacing.md },
  answerWrap: { marginTop: theme.spacing.sm },
  answer: { fontSize: 14, color: theme.colors.muted, lineHeight: 20 },
});
