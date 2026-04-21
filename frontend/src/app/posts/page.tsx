'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Post } from '../../types';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [currentUserId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
          return payload.userId;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const loadPosts = useCallback(async () => {
    try {
      const data = await api.get<Post[]>('/posts');
      // Simple sort by most recent 
      const sorted = data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(sorted);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    
    const init = async () => {
      await loadPosts();
    };
    init();
  }, [router, loadPosts]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const token = localStorage.getItem('token') || '';
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const authorId = payload.userId;

      await api.post('/posts', { authorId, title, content }, token);
      setTitle('');
      setContent('');
      await loadPosts();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const payload = JSON.parse(atob(token.split('.')[1])) as { userId: string };
      const userId = payload.userId;

      await api.put(`/posts/${postId}/like`, { userId });
      await loadPosts();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '10rem' }}>Opening Discussions...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Community Feed</h1>
          <p style={{ color: 'var(--text-muted)' }}>Insights and advice from the Reunify network.</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-outline">Back to Workspace</button>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Start a Conversation</h3>
            <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" placeholder="What's on your mind?" required className="btn btn-outline" 
                style={{ width: '100%', textAlign: 'left', padding: '1rem' }}
                value={title} onChange={e => setTitle(e.target.value)}
              />
              <textarea 
                placeholder="Share your thoughts or ask a question..." required className="btn btn-outline" 
                style={{ width: '100%', textAlign: 'left', padding: '1rem', minHeight: '150px', resize: 'none' }}
                value={content} onChange={e => setContent(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={posting}>
                {posting ? 'Sharing...' : 'Post to Feed'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {posts.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '6rem' }}>
               <p style={{ color: 'var(--text-muted)' }}>The feed is quiet today. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post: Post) => (
              <div key={post.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{post.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>{post.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                  <button 
                    onClick={() => handleLike(post.id)} 
                    className="btn" 
                    style={{ 
                      padding: '0.5rem 1.2rem', fontSize: '0.85rem', gap: '0.5rem',
                      background: currentUserId && post.likedBy?.includes(currentUserId) ? 'var(--primary-red)' : 'white',
                      color: currentUserId && post.likedBy?.includes(currentUserId) ? 'white' : 'black',
                      boxShadow: currentUserId && post.likedBy?.includes(currentUserId) ? 'none' : 'var(--shadow-sm)',
                      transform: currentUserId && post.likedBy?.includes(currentUserId) ? 'translate(2px, 2px)' : 'none'
                    }}
                  >
                     ♥ {post.likes}
                  </button>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '32px', height: '32px', background: 'var(--primary-blue)', borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, color: 'white', border: '2px solid black' }}>
                        {post.authorName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span style={{ color: 'var(--foreground)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {post.authorName || `User #${post.authorId.substring(post.authorId.length - 4)}`}
                      </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
