import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TestBeforeRemove'>;
};

/**
 * Tests the `beforeRemove` event listener.
 *
 * This mimics the pattern used in the production app's `usePreventBackNavigation` hook.
 * On working versions (7.6.3), preventDefault() blocks the swipe-back gesture.
 * On broken versions (7.6.4+), the event fires but preventDefault() is IGNORED
 * — the user navigates back anyway.
 */
export function TestBeforeRemoveScreen({
  navigation,
}: Props): React.JSX.Element {
  const [eventLog, setEventLog] = useState<string[]>([]);
  const eventCount = useRef(0);

  useEffect(() => {
    const log = (msg: string) => {
      console.log(`[beforeRemove] ${msg}`);
      eventCount.current += 1;
      setEventLog(prev => [
        `#${eventCount.current} ${new Date().toLocaleTimeString()}: ${msg}`,
        ...prev.slice(0, 49),
      ]);
    };

    log('Listener registered — try swiping back');

    const unsubscribe = navigation.addListener('beforeRemove', e => {
      log(`Event FIRED! action.type = ${e.data.action.type}`);

      if (
        e.data.action.type === 'POP' ||
        e.data.action.type === 'GO_BACK'
      ) {
        e.preventDefault();
        log(`preventDefault() CALLED for ${e.data.action.type}`);
        log(
          'If you stay on this screen → working correctly. If you land on Home → BUG!',
        );
      }
    });

    return () => {
      log('Listener removed (unmounting)');
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>addListener('beforeRemove')</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Test Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Swipe from the left edge to go back (iOS gesture){'\n'}
          2. Watch the event log below{'\n'}
          3. Expected: log shows "preventDefault() CALLED", you STAY here{'\n'}
          4. Bug (7.6.4+): preventDefault() is called but IGNORED — you land on
          Home
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>
          Test: navigation.goBack() (should be blocked)
        </Text>
      </Pressable>

      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Event Log:</Text>
        <ScrollView style={styles.logScroll}>
          {eventLog.length === 0 ? (
            <Text style={styles.logEmpty}>No events yet...</Text>
          ) : (
            eventLog.map((entry, i) => (
              <Text
                key={i}
                style={[
                  styles.logEntry,
                  entry.includes('BUG') && styles.logEntryBug,
                  entry.includes('FIRED') && styles.logEntryFired,
                  entry.includes('preventDefault') && styles.logEntryPrevented,
                ]}>
                {entry}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  instructionBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#2e7d32',
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logBox: {
    flex: 1,
    backgroundColor: '#263238',
    padding: 12,
    borderRadius: 8,
  },
  logScroll: {
    flex: 1,
  },
  logTitle: {
    color: '#80cbc4',
    fontWeight: '600',
    marginBottom: 8,
  },
  logEmpty: {
    color: '#78909c',
    fontStyle: 'italic',
  },
  logEntry: {
    color: '#e0e0e0',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 18,
  },
  logEntryFired: {
    color: '#81c784',
  },
  logEntryPrevented: {
    color: '#fff176',
    fontWeight: 'bold',
  },
  logEntryBug: {
    color: '#ef5350',
    fontWeight: 'bold',
  },
});
