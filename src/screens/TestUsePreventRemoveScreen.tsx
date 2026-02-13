import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView} from 'react-native';
import {usePreventRemove} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackParamList} from '../navigation/RootNavigator';

/**
 * Tests the built-in `usePreventRemove` hook from @react-navigation/native.
 *
 * On working versions (7.6.3), the hook blocks the swipe-back gesture.
 * On broken versions (7.6.4+), the callback fires but the gesture completes
 * anyway — preventDefault() is ignored internally.
 */
export function TestUsePreventRemoveScreen(): React.JSX.Element {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, 'TestUsePreventRemove'>
    >();
  const [preventEnabled, setPreventEnabled] = useState(true);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const eventCount = useRef(0);

  const log = (msg: string) => {
    console.log(`[usePreventRemove] ${msg}`);
    eventCount.current += 1;
    setEventLog(prev => [
      `#${eventCount.current} ${new Date().toLocaleTimeString()}: ${msg}`,
      ...prev.slice(0, 49),
    ]);
  };

  usePreventRemove(preventEnabled, ({data}) => {
    log(`Callback FIRED! action.type = ${data.action.type}`);
    log('preventDefault() called internally by hook');
    log(
      'If you stay on this screen → working. If you land on Home → BUG!',
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>usePreventRemove()</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>Test Instructions:</Text>
        <Text style={styles.instructionText}>
          1. Swipe from the left edge to go back (iOS gesture){'\n'}
          2. Watch the event log below{'\n'}
          3. Expected: log shows callback fired, you STAY here{'\n'}
          4. Bug (7.6.4+): callback fires but you land on Home anyway
        </Text>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Prevention enabled:</Text>
        <Text
          style={[
            styles.statusValue,
            {color: preventEnabled ? '#2e7d32' : '#d32f2f'},
          ]}>
          {preventEnabled ? 'YES' : 'NO'}
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>
          Test: navigation.goBack() (should be blocked)
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.toggleButton]}
        onPress={() => setPreventEnabled(prev => !prev)}>
        <Text style={styles.buttonText}>
          {preventEnabled ? 'Disable' : 'Enable'} Prevention
        </Text>
      </Pressable>

      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Event Log:</Text>
        <ScrollView style={styles.logScroll}>
          {eventLog.length === 0 ? (
            <Text style={styles.logEmpty}>
              No events yet — try swiping back...
            </Text>
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

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          This screen uses the official usePreventRemove() hook. If it's also
          broken, the regression is in the core gesture/event system.
        </Text>
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
  statusBox: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  statusLabel: {
    fontWeight: '600',
    color: '#1a73e8',
  },
  statusValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#ff8f00',
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
    marginBottom: 12,
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
  noteBox: {
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
