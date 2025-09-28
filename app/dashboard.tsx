import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Chip, FAB, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  display_name: string;
  phone: string;
  is_online: boolean;
  avatar_url?: string;
}

export default function DashboardScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser();
    fetchUsers();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchUsers = async () => {
    try {
      // In a real app, you'd fetch from your users table
      // For demo, we'll use mock data
      const mockUsers: User[] = [
        {
          id: '1',
          display_name: 'Priya Sharma',
          phone: '+91 98765 43210',
          is_online: true,
          avatar_url: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: '2',
          display_name: 'Arjun Patel',
          phone: '+91 87654 32109',
          is_online: true,
          avatar_url: 'https://i.pravatar.cc/150?img=2'
        },
        {
          id: '3',
          display_name: 'Kavya Reddy',
          phone: '+91 76543 21098',
          is_online: false,
          avatar_url: 'https://i.pravatar.cc/150?img=3'
        },
        {
          id: '4',
          display_name: 'Rohit Singh',
          phone: '+91 65432 10987',
          is_online: true,
          avatar_url: 'https://i.pravatar.cc/150?img=4'
        },
      ];
      setUsers(mockUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (user: User, type: 'audio' | 'video') => {
    router.push({
      pathname: '/call/[id]',
      params: { 
        id: user.id,
        name: user.display_name,
        type: type,
        avatar: user.avatar_url || ''
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const filteredUsers = users.filter(user =>
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <Avatar.Image 
            size={50} 
            source={{ uri: item.avatar_url || 'https://i.pravatar.cc/150' }} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.display_name}</Text>
            <Text style={styles.userPhone}>{item.phone}</Text>
            <Chip 
              mode="outlined" 
              style={[styles.statusChip, { backgroundColor: item.is_online ? '#e8f5e8' : '#f5f5f5' }]}
              textStyle={{ color: item.is_online ? '#2e7d32' : '#666' }}
            >
              {item.is_online ? 'Online' : 'Offline'}
            </Chip>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => handleCall(item, 'audio')}
            style={styles.callButton}
            icon="phone"
          >
            Call
          </Button>
          <Button
            mode="contained"
            onPress={() => handleCall(item, 'video')}
            style={styles.videoButton}
            icon="video"
          >
            Video
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>SocialCall</Text>
          <Button mode="text" onPress={handleSignOut} icon="logout">
            Sign Out
          </Button>
        </View>
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="account-plus"
        style={styles.fab}
        onPress={() => Alert.alert('Coming Soon', 'Add contacts feature coming soon!')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  searchbar: {
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  userCard: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButton: {
    flex: 1,
    marginRight: 8,
  },
  videoButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#ff6b35',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff6b35',
  },
});