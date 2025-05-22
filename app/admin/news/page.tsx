'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArticleForm } from './article-form';

interface User {
  id: string;
}

interface UserRole {
  user_id: string;
  is_admin: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary?: string;
  published_date: string;
  author?: string;
  category?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNewsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminStatusAndFetchUser() {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('Error fetching session or no session:', sessionError);
        router.push('/login');
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('is_admin')
          .eq('user_id', currentUser.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setIsAdmin(false);
        } else if (roleData) {
          setIsAdmin(roleData.is_admin);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }

    checkAdminStatusAndFetchUser();
  }, [supabase, router]);

  async function fetchNewsArticles() {
    if (!isAdmin) return;
    setLoadingArticles(true);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_date', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news articles:', error);
      // Handle error display to user if needed
    }
    setLoadingArticles(false);
  }

  useEffect(() => {
    if (isAdmin) {
      fetchNewsArticles();
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-2 text-lg">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go to Homepage
        </Button>
      </div>
    );
  }

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDeleteArticle = async (articleId: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      console.log(`Attempting to delete article ${articleId}`);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  const handleFormSubmitSuccess = async (articleId?: number) => {
    setIsFormOpen(false);
    setEditingArticle(null);
    await fetchNewsArticles();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Manage News Articles</h1>
        <Button onClick={handleCreateArticle}>Create New Article</Button>
      </header>

      {loadingArticles ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No news articles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card border border-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{article.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{article.author || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{article.category || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(article.published_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <ArticleForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          article={editingArticle}
          onFormSubmitSuccess={handleFormSubmitSuccess}
        />
      )}
    </div>
  );
} 