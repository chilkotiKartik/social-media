-- Insert demo users for testing (these will be created after real users sign up)
-- This script creates sample profiles to demonstrate the app functionality

-- Note: These profiles will be linked to actual auth.users created through the signup process
-- The trigger will handle profile creation, but we can update them with demo data

-- Demo user data (to be applied after users sign up)
-- User 1: Sarah Johnson (Female, 28)
-- User 2: Mike Chen (Male, 32) 
-- User 3: Alex Rivera (Other, 25)
-- User 4: Emma Davis (Female, 30)
-- User 5: James Wilson (Male, 27)

-- This script serves as documentation for demo data
-- In a real demo, you would sign up these users through the UI
-- and then update their profiles with this information

-- Example update queries (run after demo users sign up):
/*
UPDATE profiles SET 
  display_name = 'Sarah Johnson',
  gender = 'female',
  date_of_birth = '1995-03-15',
  bio = 'Love traveling and meeting new people! Always up for a good conversation about books, movies, or life adventures.',
  is_online = true,
  avatar_url = '/placeholder.svg?height=100&width=100'
WHERE email = 'sarah@demo.com';

UPDATE profiles SET 
  display_name = 'Mike Chen',
  gender = 'male', 
  date_of_birth = '1991-08-22',
  bio = 'Tech enthusiast and coffee lover. Enjoy discussing startups, gaming, and exploring new cities.',
  is_online = true,
  avatar_url = '/placeholder.svg?height=100&width=100'
WHERE email = 'mike@demo.com';

UPDATE profiles SET 
  display_name = 'Alex Rivera',
  gender = 'other',
  date_of_birth = '1998-11-10', 
  bio = 'Artist and creative soul. Love music, painting, and deep conversations about life and creativity.',
  is_online = false,
  last_seen = NOW() - INTERVAL '2 hours',
  avatar_url = '/placeholder.svg?height=100&width=100'
WHERE email = 'alex@demo.com';

UPDATE profiles SET 
  display_name = 'Emma Davis',
  gender = 'female',
  date_of_birth = '1993-05-18',
  bio = 'Fitness coach and wellness enthusiast. Always excited to share tips about healthy living and motivation!',
  is_online = true,
  avatar_url = '/placeholder.svg?height=100&width=100'
WHERE email = 'emma@demo.com';

UPDATE profiles SET 
  display_name = 'James Wilson', 
  gender = 'male',
  date_of_birth = '1996-12-03',
  bio = 'Musician and world traveler. Love sharing stories from my adventures and jamming with fellow music lovers.',
  is_online = false,
  last_seen = NOW() - INTERVAL '1 day',
  avatar_url = '/placeholder.svg?height=100&width=100'
WHERE email = 'james@demo.com';
*/

-- Create some demo call records for testing
-- These will be inserted after demo users exist
/*
INSERT INTO calls (caller_id, receiver_id, call_type, status, started_at, ended_at, duration_seconds) VALUES
-- Completed calls
((SELECT id FROM profiles WHERE display_name = 'Sarah Johnson'), (SELECT id FROM profiles WHERE display_name = 'Mike Chen'), 'video', 'ended', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours' + INTERVAL '8 minutes', 480),
((SELECT id FROM profiles WHERE display_name = 'Emma Davis'), (SELECT id FROM profiles WHERE display_name = 'Alex Rivera'), 'audio', 'ended', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '15 minutes', 900),
-- Missed calls  
((SELECT id FROM profiles WHERE display_name = 'James Wilson'), (SELECT id FROM profiles WHERE display_name = 'Sarah Johnson'), 'video', 'missed', NOW() - INTERVAL '3 hours', NULL, 0),
-- Recent calls
((SELECT id FROM profiles WHERE display_name = 'Mike Chen'), (SELECT id FROM profiles WHERE display_name = 'Emma Davis'), 'audio', 'ended', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '25 minutes', 300);
*/
