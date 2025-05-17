'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createNewsArticle, updateNewsArticle, FormState } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { NewsArticle } from './page'; // Assuming NewsArticle interface is exported from page.tsx
import { format } from 'date-fns'; // For formatting date input

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  article?: NewsArticle | null; // Current article for editing, null for creating
  onFormSubmitSuccess: (articleId?: number) => void; // Callback after successful submission
}

const initialFormState: FormState = { message: '', success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Article'}
    </Button>
  );
}

export function ArticleForm({ isOpen, onClose, article, onFormSubmitSuccess }: ArticleFormProps) {
  const action = article ? updateNewsArticle.bind(null, article.id) : createNewsArticle;
  const [formState, formAction] = useActionState(action, initialFormState);
  const [publishedDate, setPublishedDate] = useState('');

  useEffect(() => {
    if (article?.published_date) {
      // Format date for input type='datetime-local' which expects 'yyyy-MM-ddThh:mm'
      setPublishedDate(format(new Date(article.published_date), "yyyy-MM-dd'T'HH:mm"));
    } else if (!article) {
      setPublishedDate(format(new Date(), "yyyy-MM-dd'T'HH:mm")); // Default to now for new articles
    }

    if (formState.success) {
      onFormSubmitSuccess(formState.articleId);
      // Reset form or close modal can be handled here or by parent
    }
  }, [article, formState.success, formState.articleId, onFormSubmitSuccess]);
  
  // If the dialog is not open, don't render anything or render minimally
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Create New Article'}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={article?.title || ''} required />
            {formState.errors?.title && <p className="text-sm text-red-500">{formState.errors.title.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" defaultValue={article?.content || ''} rows={8} required />
            {formState.errors?.content && <p className="text-sm text-red-500">{formState.errors.content.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="summary">Summary (Optional)</Label>
            <Textarea id="summary" name="summary" defaultValue={article?.summary || ''} rows={3} />
            {formState.errors?.summary && <p className="text-sm text-red-500">{formState.errors.summary.join(', ')}</p>}
          </div>

          <div>
            <Label htmlFor="published_date">Published Date</Label>
            <Input 
              id="published_date" 
              name="published_date" 
              type="datetime-local" 
              value={publishedDate} 
              onChange={(e) => setPublishedDate(e.target.value)}
              required 
            />
            {formState.errors?.published_date && <p className="text-sm text-red-500">{formState.errors.published_date.join(', ')}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author (Optional)</Label>
              <Input id="author" name="author" defaultValue={article?.author || ''} />
              {formState.errors?.author && <p className="text-sm text-red-500">{formState.errors.author.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category (Optional)</Label>
              <Input id="category" name="category" defaultValue={article?.category || ''} />
              {formState.errors?.category && <p className="text-sm text-red-500">{formState.errors.category.join(', ')}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={article?.image_url || ''} />
            {formState.errors?.image_url && <p className="text-sm text-red-500">{formState.errors.image_url.join(', ')}</p>}
          </div>

          {formState.message && !formState.success && <p className="text-sm text-red-500">{formState.message}</p>}
          {formState.message && formState.success && <p className="text-sm text-green-500">{formState.message}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 