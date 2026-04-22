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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '6px solid black', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: '3.5rem', lineHeight: '0.9', marginBottom: '0.5rem' }}>DISCOURSE</h1>
          <p className="label-caps" style={{ color: 'var(--primary-blue)', fontWeight: 900 }}>REUNIFY COMMUNITY FEED_V2</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-outline" style={{ border: '3px solid black', height: 'fit-content' }}>✕ CLOSE</button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Create Post Section - Bauhaus Style */}
        <div style={{ border: '4px solid black', background: 'var(--primary-yellow)', padding: '2rem', boxShadow: '8px 8px 0 black' }}>
          <h3 className="label-caps" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Broadcast an update_</h3>
          <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input 
              type="text" placeholder="SUBJECT LINE" required 
              style={{ width: '100%', padding: '1rem', border: '3px solid black', fontWeight: 900, textTransform: 'uppercase', outline: 'none' }}
              value={title} onChange={e => setTitle(e.target.value)}
            />
            <textarea 
              placeholder="SHARE INSIGHTS, ASK QUESTIONS, OR POST UPDATES..." required 
              style={{ width: '100%', padding: '1rem', minHeight: '120px', border: '3px solid black', fontWeight: 700, resize: 'none', outline: 'none', fontFamily: 'inherit' }}
              value={content} onChange={e => setContent(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={posting} style={{ width: '100%', background: 'black', color: 'white', border: 'none', padding: '1.2rem', fontSize: '1rem' }}>
              {posting ? 'TRANSMITTING...' : 'PUBLISH TO NETWORK →'}
            </button>
          </form>
        </div>

        {/* Feed Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '8rem 2rem', border: '4px dashed #ccc' }}>
               <p className="label-caps" style={{ color: '#888' }}>No frequency detected. Start the transmission.</p>
            </div>
          ) : (
            posts.map((post: Post) => (
              <article key={post.id} style={{ border: '4px solid black', background: 'white', boxShadow: '12px 12px 0 black', position: 'relative' }}>
                
                {/* Instagram-like Header but Bauhaus */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.5rem', borderBottom: '3px solid black', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '48px', height: '48px', background: 'var(--primary-blue)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '1.2rem', fontWeight: 900, color: 'white', 
                      border: '3px solid black', transform: 'rotate(-3deg)' 
                    }}>
                      {post.authorName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {post.authorName || `USER_${post.authorId.substring(0, 5)}`}
                      </p>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#888' }}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div style={{ height: '12px', width: '12px', background: 'var(--primary-red)', borderRadius: '50%', border: '2px solid black' }} />
                </div>

                {/* Content Area */}
                <div style={{ padding: '2.5rem 1.5rem', background: 'white' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem', textTransform: 'uppercase', lineHeight: '1.1' }}>{post.title}</h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontWeight: 500, color: '#333', whiteSpace: 'pre-line' }}>{post.content}</p>
                </div>

                {/* Bauhaus Graphic Element (Decorative) */}
                <div style={{ height: '8px', width: '100%', background: 'linear-gradient(90deg, var(--primary-red) 33%, var(--primary-blue) 33%, var(--primary-blue) 66%, var(--primary-yellow) 66%)', borderTop: '3px solid black', borderBottom: '3px solid black' }} />

                {/* Interaction Footer */}
                <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => handleLike(post.id)} 
                      style={{ 
                        background: currentUserId && post.likedBy?.includes(currentUserId) ? 'var(--primary-red)' : 'white',
                        color: currentUserId && post.likedBy?.includes(currentUserId) ? 'white' : 'black',
                        border: '3px solid black',
                        padding: '0.6rem 1.2rem',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'transform 0.1s',
                        boxShadow: currentUserId && post.likedBy?.includes(currentUserId) ? 'none' : '4px 4px 0 black',
                        transform: currentUserId && post.likedBy?.includes(currentUserId) ? 'translate(2px, 2px)' : 'none'
                      }}
                    >
                      <span>{currentUserId && post.likedBy?.includes(currentUserId) ? '♥' : '♡'}</span>
                      <span>{post.likes} LIKES</span>
                    </button>

                    <button style={{ 
                      background: 'white', border: '3px solid black', padding: '0.6rem 1.2rem', 
                      fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '4px 4px 0 black'
                    }}>
                      💬 DISCUSS
                    </button>
                  </div>
                  
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                    <div style={{ width: '20px', height: '3px', background: 'black', marginBottom: '4px' }} />
                    <div style={{ width: '20px', height: '3px', background: 'black', marginBottom: '4px' }} />
                    <div style={{ width: '10px', height: '3px', background: 'black' }} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
