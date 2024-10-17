import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Home = () => {
  const [link, setLink] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [satisfaction, setSatisfaction] = useState(null);
  const [counts, setCounts] = useState({ yes: 0, no: 0 });

  const handleSubmit = async () => {
    if (!link) {
      setError('Please enter a news link.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setSatisfaction(null);

    try {
      const response = await axios.post('http://localhost:5000/api/verify', { link });
      setResult(response.data);
    } catch (error) {
      console.error("Error verifying link:", error);
      setError('Failed to verify the link. Please try again.');
    }
    setLoading(false);
  };

  const handleSatisfaction = async (response) => {
    try {
      const satisfactionResponse = await axios.post('http://localhost:5000/api/satisfaction', { response });
      setCounts(satisfactionResponse.data.satisfactionCounts);
      setSatisfaction(response);
    } catch (error) {
      console.error("Error recording satisfaction response:", error);
      setError('Failed to record satisfaction response.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SatyaVerify</Text>
      <Text style={styles.subtitle}>Instantly verify the credibility of news articles</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={link}
          onChangeText={setLink}
          placeholder="Enter news link"
          placeholderTextColor="#888"
          accessible={true}
          accessibilityLabel="News link input"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Verification Results</Text>
          <Text><strong>Credibility Score:</strong> {result.credibilityScore} / 100</Text>
          <Text><strong>Message:</strong> {result.message}</Text>

          <Text style={styles.satisfactionText}>Are you satisfied with the results?</Text>
          <View style={styles.satisfactionButtons}>
            <TouchableOpacity onPress={() => handleSatisfaction('yes')} style={styles.satisfactionButton}>
              <Text style={styles.satisfactionButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSatisfaction('no')} style={styles.satisfactionButton}>
              <Text style={styles.satisfactionButtonText}>No</Text>
            </TouchableOpacity>
          </View>

          {satisfaction && (
            <Text style={styles.feedbackText}>
              Thank you for your feedback! You responded: <strong>{satisfaction}</strong>.
              {'\n'}Current counts: Yes: {counts.yes}, No: {counts.no}
            </Text>
          )}
        </View>
      )}

      <Text style={styles.footer}>Stay aware, stay informed. Avoid fake news!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e', // A dark background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#3a3a3c',
    borderRadius: 8,
    padding: 10,
    color: '#ffffff',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF', // iOS blue
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  satisfactionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  satisfactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  satisfactionButton: {
    backgroundColor: '#34C759', // Green
    borderRadius: 5,
    padding: 10,
    width: '40%',
    alignItems: 'center',
  },
  satisfactionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  feedbackText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  footer: {
    marginTop: 20,
    color: '#888888',
    fontSize: 14,
  },
});

export default Home;
