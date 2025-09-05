import React, { useState, useEffect } from 'react';
interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  category_name: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/posts`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setPosts(data.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error fetching posts: {error}</div>;
  }

  return (
    <div>
      <h1>Latest Posts</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
              <h2>{post.title}</h2>
              <p><strong>Category:</strong> {post.category_name}</p>
              <p>{post.body}</p>
              <small>By: {post.author}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default PostList;