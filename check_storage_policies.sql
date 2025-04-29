SELECT * FROM storage.policies WHERE table_id = 'objects' ORDER BY policy_id;

-- Enable row-level security on storage.objects if it isn't already enabled
ALTER TABLE storage.objects
  ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own avatar files into the 'avatars' bucket
CREATE POLICY allow_insert_avatars
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND owner = auth.uid()
  );

-- Allow anyone (public bucket) to select objects in the 'avatars' bucket
CREATE POLICY allow_select_avatars
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'avatars'
  );

-- Allow authenticated users to delete their own avatar files in the 'avatars' bucket
CREATE POLICY allow_delete_avatars
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND owner = auth.uid()
  );
