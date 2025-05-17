'use client'; // Assuming this might become interactive later with admin features

import { createClient } from '@/utils/supabase/client'; // Using client for potential future interactivity
import { useEffect, useState } from 'react';
import { format } from 'date-fns'; // Will address if installation is still an issue
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogOverlay, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // For close button in modal

interface NewsArticle {
  id: number;
  title: string;
  content: string; // Full content
  summary?: string; // Optional summary
  published_date: string;
  author?: string;
  category?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

async function getNewsArticlesClient(): Promise<NewsArticle[]> {
  const supabase = createClient(); // Using the client-side Supabase client
  const { data, error } = await supabase
    .from('news_articles')
    .select('*') // Select all columns for now
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
  return data || [];
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticleForModal, setSelectedArticleForModal] = useState<NewsArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('news_articles')
          .select('*') // Fetch all data for modal display
          .order('published_date', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }
        setArticles(data || []);
      } catch (e: any) {
        console.error('Failed to fetch news articles:', e);
        setError(e.message || 'Failed to load articles.');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleArticleCardClick = (article: NewsArticle) => {
    setSelectedArticleForModal(article);
    setIsArticleModalOpen(true);
  };

  const handleModalClose = () => {
    setIsArticleModalOpen(false);
    // Delay clearing selected article to allow for modal close animation
    setTimeout(() => {
      setSelectedArticleForModal(null);
    }, 300); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-xl">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground">
        <p className="text-xl text-red-500">Error loading news articles.</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <main className="p-10">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-primary">
              News & Updates
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              The latest articles and announcements.
            </p>
          </header>

          {articles.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="text-xl">No news articles yet.</p>
              <p>Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col rounded-xl border-white/10 bg-black/20 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer group"
                  onClick={() => handleArticleCardClick(article)}
                >
                  {article.image_url && (
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                      <Image
                        src={article.image_url}
                        alt={article.title || 'News article image'}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-semibold text-primary mb-2 leading-tight">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-muted-foreground mb-3 flex-grow">
                        {article.summary}
                      </p>
                    )}
                    {!article.summary && article.content && (
                       <div
                          className="text-muted-foreground mb-3 flex-grow prose prose-sm prose-invert max-w-none overflow-hidden"
                          style={{ maxHeight: '4.5em' }} // Approx 3 lines of text
                          dangerouslySetInnerHTML={{ __html: article.content.substring(0, 150) + (article.content.length > 150 ? '...' : '') }}
                        />
                    )}
                    <div className="mt-auto pt-3 border-t border-border/20">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        {article.author && <span>By {article.author}</span>}
                        {article.category && <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{article.category}</span>}
                      </div>
                      <time
                        dateTime={article.published_date}
                        className="block text-xs text-muted-foreground mt-1"
                      >
                        Published: {format(new Date(article.published_date), 'MMMM dd, yyyy')}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedArticleForModal && (
        <Dialog open={isArticleModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
          <DialogOverlay />
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-4">{selectedArticleForModal.title}</DialogTitle>
              {(selectedArticleForModal.author || selectedArticleForModal.published_date) && (
                <div className="text-sm text-muted-foreground mb-4">
                  {selectedArticleForModal.author && <span>By {selectedArticleForModal.author}</span>}
                  {selectedArticleForModal.author && selectedArticleForModal.published_date && <span className="mx-2">|</span>}
                  {selectedArticleForModal.published_date && (
                    <time dateTime={selectedArticleForModal.published_date}>
                      Published: {format(new Date(selectedArticleForModal.published_date), 'MMMM dd, yyyy')}
                    </time>
                  )}
                  {selectedArticleForModal.category && (
                     <span className="ml-2 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">{selectedArticleForModal.category}</span>
                  )}
                </div>
              )}
            </DialogHeader>
            
            {selectedArticleForModal.image_url && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={selectedArticleForModal.image_url}
                  alt={selectedArticleForModal.title || 'News article image'}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div 
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: selectedArticleForModal.content }}
            />
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 