import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import backgroundImage from '../assets/bg.png';

const LandingPage = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate("Home");
  };

  return (
    <ImageBackground 
  source={backgroundImage} 
  style={styles.container}
  resizeMode="cover"
>
      {/* Main Content Area */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {/* Title */}
          <Text style={styles.title}>सत्य-Verify</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Know the truth, make the right decisions</Text>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Check the NEWS!!!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center the content vertically
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center', // Center align the text container
    justifyContent: 'center', // Center the content
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center', // Center align text within the container
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add a slight background for readability
    borderRadius: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center', // Center align subtitle text
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 4,
    borderColor: '#6f77ff',
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default LandingPage;
