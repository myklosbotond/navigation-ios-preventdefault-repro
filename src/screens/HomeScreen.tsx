import React, {useCallback, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import type {RootStackParamList} from '../navigation/RootNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({navigation}: Props): React.JSX.Element {
  const stackVersion =
    require('@react-navigation/stack/package.json').version;
  const nativeVersion =
    require('@react-navigation/native/package.json').version;

  const [returnLog, setReturnLog] = useState<string[]>([]);
  const visitCount = useRef(0);

  // Detect when user returns to this screen (after first focus)
  useFocusEffect(
    useCallback(() => {
      visitCount.current += 1;
      if (visitCount.current > 1) {
        const entry = `${new Date().toLocaleTimeString()}: Returned to Home (visit #${visitCount.current}) — if you were on a test screen, preventDefault() was IGNORED (BUG!)`;
        setReturnLog(prev => [entry, ...prev.slice(0, 9)]);
      }
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>iOS Swipe preventDefault Regression Reproducer</Text>

      <View style={styles.versionBox}>
        <Text style={styles.versionLabel}>Current versions:</Text>
        <Text style={styles.versionText}>
          @react-navigation/stack: {stackVersion}
        </Text>
        <Text style={styles.versionText}>
          @react-navigation/native: {nativeVersion}
        </Text>
      </View>

      <Text style={styles.instructions}>
        Navigate to a test screen, then swipe back on iOS.{'\n'}
        The back gesture should be{' '}
        <Text style={styles.bold}>blocked</Text> — but on broken versions,
        {'\n'}
        <Text style={styles.bold}>preventDefault() is ignored</Text> and you
        land back here.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('TestBeforeRemove')}>
        <Text style={styles.buttonText}>
          Test: addListener('beforeRemove')
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('TestUsePreventRemove')}>
        <Text style={styles.buttonText}>Test: usePreventRemove()</Text>
      </Pressable>

      {returnLog.length > 0 && (
        <View style={styles.returnLogBox}>
          <Text style={styles.returnLogTitle}>
            Return Detection Log:
          </Text>
          {returnLog.map((entry, i) => (
            <Text key={i} style={styles.returnLogEntry}>
              {entry}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How to switch versions:</Text>
        <Text style={styles.infoText}>
          yarn use:working{'\n'}
          yarn use:just-broke{'\n'}
          yarn use:latest
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  versionBox: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  versionLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a73e8',
  },
  versionText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#555',
  },
  instructions: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#7b1fa2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  returnLogBox: {
    marginTop: 16,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d32f2f',
  },
  returnLogTitle: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#d32f2f',
    fontSize: 14,
  },
  returnLogEntry: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#b71c1c',
    lineHeight: 18,
  },
  infoBox: {
    marginTop: 16,
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#e65100',
  },
  infoText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#555',
    lineHeight: 20,
  },
});
