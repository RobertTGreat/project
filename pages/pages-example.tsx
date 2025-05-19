import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/pages-client';
import { hasSupabaseEnvVars } from '@/lib/supabase/pages-client';

export default function PagesExample() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pages Router Example</h1>
      <p className="mb-4">
        Supabase connection: {hasSupabaseEnvVars ? 'Available' : 'Unavailable'}
      </p>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
