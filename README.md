# SocialCall Mobile - React Native Expo App

A mobile social calling application built with React Native and Expo, featuring OTP authentication and WebRTC calling.

## Features

- 📱 Mobile OTP Authentication (SMS-based)
- 📞 Voice & Video Calls using WebRTC
- 👥 User Directory & Search
- 🔊 HD Audio with Noise Cancellation
- 📱 Native Mobile Experience
- 🔒 Secure Authentication with Supabase

## Tech Stack

- **React Native** with Expo
- **Supabase** for authentication and backend
- **WebRTC** for real-time communication
- **React Native Paper** for UI components
- **Expo Router** for navigation

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase:
   - Update `lib/supabase.ts` with your Supabase URL and anon key
   - Enable Phone Auth in your Supabase project
   - Configure SMS provider (Twilio recommended)

3. Start the development server:
```bash
npm start
```

4. Run on device/simulator:
```bash
npm run ios     # iOS
npm run android # Android
```

## Project Structure

```
app/
├── _layout.tsx          # Root layout with navigation
├── index.tsx            # Welcome screen
├── auth/
│   ├── phone.tsx        # Phone number input
│   └── verify.tsx       # OTP verification
├── dashboard.tsx        # Main user directory
└── call/
    └── [id].tsx         # Call interface

lib/
├── supabase.ts          # Supabase client configuration
└── webrtc-service.ts    # WebRTC service for calls
```

## Key Features

### OTP Authentication
- SMS-based phone verification
- Secure token validation
- Automatic session management

### WebRTC Calling
- Peer-to-peer voice and video calls
- Real-time audio/video streaming
- Call controls (mute, video toggle, speaker)
- Connection quality monitoring

### Mobile-First Design
- Native mobile UI components
- Responsive layouts
- Touch-friendly interactions
- Platform-specific optimizations

## Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Phone Auth in Authentication settings
3. Configure SMS provider (Twilio, MessageBird, etc.)
4. Update environment variables in `lib/supabase.ts`

### WebRTC Configuration
- STUN servers configured for NAT traversal
- Audio processing with echo cancellation
- Video quality optimization for mobile

## Development

### Running the App
```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Deployment

### App Store Deployment
1. Configure app.json with proper bundle identifiers
2. Set up certificates and provisioning profiles
3. Build and submit via Expo Application Services (EAS)

### Google Play Deployment
1. Configure Android-specific settings in app.json
2. Generate signed APK/AAB
3. Upload to Google Play Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.