-- Drop existing RLS policies for users table if they exist
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

-- Create a policy that allows inserting data for authenticated users
CREATE POLICY "Users can insert their own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy that allows users to select their own data
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a policy that allows users to update their own data
DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
