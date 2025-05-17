'use server';

import { createClient } from '@/utils/supabase/server'; // Server client for actions
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper function to check admin status (essential for server actions)
async function isAdminUser(): Promise<boolean> {
  const supabase = await createClient(); // Corrected: No cookieStore argument

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not authenticated or error fetching user:', userError);
    return false;
  }

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (roleError) {
    console.error('Error fetching user role in action:', roleError);
    return false;
  }
  return roleData?.is_admin || false;
}

// Zod schema for validating article data
const ArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  summary: z.string().optional(),
  published_date: z.string().refine((date: string) => !isNaN(new Date(date).getTime()), { // Added type for date
    message: "Invalid date format for published date",
  }),
  author: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().url('Invalid URL format for image').optional().or(z.literal('')),
});

export type FormState = {
  message: string;
  errors?: {
    [K in keyof z.infer<typeof ArticleSchema>]?: string[];
  };
  success: boolean;
  articleId?: number;
};

export async function createNewsArticle(prevState: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdminUser())) {
    return { message: 'Unauthorized: Admin access required.', success: false };
  }

  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    summary: formData.get('summary'),
    published_date: formData.get('published_date'),
    author: formData.get('author'),
    category: formData.get('category'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation Error: Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  const supabase = await createClient(); // Corrected: No cookieStore argument

  // Ensure published_date is in ISO format for Supabase
  const publishedDateISO = new Date(validatedFields.data.published_date).toISOString();

  const { data, error } = await supabase
    .from('news_articles')
    .insert([
      {
        ...validatedFields.data,
        published_date: publishedDateISO,
        image_url: validatedFields.data.image_url || null, // Ensure empty string becomes null
      },
    ])
    .select('id') // Select the ID of the newly created article
    .single(); // Expecting a single record back

  if (error) {
    console.error('Supabase error creating article:', error);
    return { message: `Database Error: ${error.message}`, success: false };
  }

  revalidatePath('/admin/news'); // Revalidate the admin news page
  revalidatePath('/news'); // Also revalidate the public news page
  
  return { message: 'Article created successfully!', success: true, articleId: data?.id };
}

// Placeholder for updateNewsArticle
export async function updateNewsArticle(articleId: number, prevState: FormState, formData: FormData): Promise<FormState> {
  if (!(await isAdminUser())) {
    return { message: 'Unauthorized: Admin access required.', success: false };
  }
  
  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    summary: formData.get('summary'),
    published_date: formData.get('published_date'),
    author: formData.get('author'),
    category: formData.get('category'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation Error: Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const supabase = await createClient(); // Corrected
  const publishedDateISO = new Date(validatedFields.data.published_date).toISOString();

  const { error } = await supabase
    .from('news_articles')
    .update({
      ...validatedFields.data,
      published_date: publishedDateISO,
      image_url: validatedFields.data.image_url || null,
      updated_at: new Date().toISOString(), // Also update the updated_at timestamp
    })
    .eq('id', articleId);

  if (error) {
    console.error('Supabase error updating article:', error);
    return { message: `Database Error: ${error.message}`, success: false };
  }

  revalidatePath('/admin/news');
  revalidatePath('/news');
  return { message: 'Article updated successfully!', success: true, articleId };
}

export async function deleteNewsArticle(articleId: number): Promise<FormState> {
  if (!(await isAdminUser())) {
    return { message: 'Unauthorized: Admin access required.', success: false };
  }

  const supabase = await createClient(); // Corrected: No cookieStore argument

  const { error } = await supabase
    .from('news_articles')
    .delete()
    .match({ id: articleId });

  if (error) {
    console.error('Supabase error deleting article:', error);
    return { message: `Database Error: ${error.message}`, success: false };
  }

  revalidatePath('/admin/news');
  revalidatePath('/news');
  return { message: 'Article deleted successfully!', success: true };
} 