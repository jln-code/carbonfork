import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Button,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";

interface CameraModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPhotoTaken?: (photoUri: string) => void;
}

function CameraModal({ isVisible, onClose, onPhotoTaken }: CameraModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Handle taking a photo
  const takePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        console.log("Photo captured:", photo.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error("Photo capture error:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle retaking photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  // Handle confirming photo
  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken?.(capturedPhoto);
      setCapturedPhoto(null);
      onClose();
    }
  };

  // Handle closing modal
  const handleClose = () => {
    setCapturedPhoto(null);
    onClose();
  };

  // Check if permission is granted
  if (!permission) {
    // Camera permissions are still loading
    return (
      <Modal visible={isVisible} onRequestClose={handleClose}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Modal visible={isVisible} onRequestClose={handleClose}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.permissionButton, styles.closePermissionButton]}
            onPress={handleClose}>
            <Text style={styles.permissionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        {/* Camera or Photo Preview Container */}
        <View style={styles.cameraContainer}>
          {capturedPhoto ? (
            // Show captured photo
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.previewImage}
            />
          ) : (
            // Show camera view
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              zoom={0.15}
            />
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {capturedPhoto ? (
            // Photo taken - show confirm/retake buttons
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={retakePhoto}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={confirmPhoto}>
                <Text style={[styles.buttonText, { color: "#333" }]}>
                  Use Photo
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // Camera view - show capture/close buttons
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>

              {/* Camera Capture Button */}
              <TouchableOpacity
                style={[
                  styles.captureButton,
                  isCapturing && styles.capturingButton,
                ]}
                onPress={takePhoto}
                disabled={isCapturing}
                activeOpacity={0.8}>
                <View
                  style={[
                    styles.captureButtonInner,
                    isCapturing && styles.capturingButtonInner,
                  ]}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  permissionText: {
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 5,
    minWidth: 150,
  },
  closePermissionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
  },
  primaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minWidth: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  capturingButton: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  capturingButtonInner: {
    backgroundColor: "#ff6b6b",
  },
});

export default CameraModal;
