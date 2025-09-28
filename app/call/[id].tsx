import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Text, Button, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { RTCView, RTCPeerConnection, RTCSessionDescription, mediaDevices } from 'react-native-webrtc';
import { WebRTCService } from '../../lib/webrtc-service';

const { width, height } = Dimensions.get('window');

export default function CallScreen() {
  const { id, name, type, avatar } = useLocalSearchParams<{
    id: string;
    name: string;
    type: 'audio' | 'video';
    avatar: string;
  }>();

  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);

  const webrtcService = useRef<WebRTCService | null>(null);
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (callStatus === 'connected') {
      callTimer.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (callTimer.current) {
        clearInterval(callTimer.current);
      }
    };
  }, [callStatus]);

  const initializeCall = async () => {
    try {
      webrtcService.current = new WebRTCService();
      
      // Get user media
      const stream = await webrtcService.current.getUserMedia({
        video: type === 'video',
        audio: true,
      });
      
      setLocalStream(stream);

      // Simulate connection after 2 seconds
      setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

    } catch (error) {
      Alert.alert('Error', 'Failed to initialize call');
      router.back();
    }
  };

  const endCall = () => {
    if (webrtcService.current) {
      webrtcService.current.cleanup();
    }
    if (callTimer.current) {
      clearInterval(callTimer.current);
    }
    setCallStatus('ended');
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const toggleMute = () => {
    if (webrtcService.current) {
      webrtcService.current.toggleAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (webrtcService.current && type === 'video') {
      webrtcService.current.toggleVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, you'd implement speaker toggle
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Views */}
      {type === 'video' && isVideoEnabled && (
        <View style={styles.videoContainer}>
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={styles.remoteVideo}
              objectFit="cover"
            />
          )}
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.localVideo}
              objectFit="cover"
              mirror={true}
            />
          )}
        </View>
      )}

      {/* Audio Call UI */}
      {(type === 'audio' || !isVideoEnabled) && (
        <View style={styles.audioContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.callerName}>{name}</Text>
            <Text style={styles.callStatus}>
              {callStatus === 'connecting' ? 'Connecting...' : 
               callStatus === 'connected' ? formatDuration(callDuration) : 
               'Call ended'}
            </Text>
          </View>
        </View>
      )}

      {/* Call Status Bar */}
      <Surface style={styles.statusBar}>
        <Text style={styles.statusText}>
          {callStatus === 'connecting' ? 'Connecting...' : 
           callStatus === 'connected' ? `${formatDuration(callDuration)} • HD Audio` : 
           'Call ended'}
        </Text>
      </Surface>

      {/* Call Controls */}
      <View style={styles.controls}>
        <IconButton
          icon={isMuted ? 'microphone-off' : 'microphone'}
          mode="contained"
          size={24}
          iconColor="white"
          containerColor={isMuted ? '#f44336' : '#666'}
          onPress={toggleMute}
        />

        {type === 'video' && (
          <IconButton
            icon={isVideoEnabled ? 'video' : 'video-off'}
            mode="contained"
            size={24}
            iconColor="white"
            containerColor={!isVideoEnabled ? '#f44336' : '#666'}
            onPress={toggleVideo}
          />
        )}

        <IconButton
          icon={isSpeakerOn ? 'volume-high' : 'volume-medium'}
          mode="contained"
          size={24}
          iconColor="white"
          containerColor={isSpeakerOn ? '#ff6b35' : '#666'}
          onPress={toggleSpeaker}
        />

        <IconButton
          icon="phone-hangup"
          mode="contained"
          size={28}
          iconColor="white"
          containerColor="#f44336"
          onPress={endCall}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#ccc',
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});