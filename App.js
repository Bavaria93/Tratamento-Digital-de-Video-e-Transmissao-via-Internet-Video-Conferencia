import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, Modal, Image, View } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const camRef = useRef(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Acesso negado</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri)
      setOpen(true)
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        alert('Salvo com sucesso!');
      })
      .catch(error => {
        console.log('erro', error);
      })
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={() => {
            setType(type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front : Camera.Constants.Type.back)
          }}>
            <FontAwesome name='exchange' size={23} color='red'></FontAwesome>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name='camera' size={23} color='#FFF'></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
        >
          <View style={styles.contentModal}>
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity style={styles.closeButton} onPress={() => { setOpen(false) }}>
                <FontAwesome name='close' size={40} color='#FFF'></FontAwesome>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={savePicture}>
                <FontAwesome name='upload' size={40} color='#000'></FontAwesome>
              </TouchableOpacity>
            </View>
            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }}></Image>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  imgPhoto: {
    width: '100%',
    height: 450,
  }
});