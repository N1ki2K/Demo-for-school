import React, { useState, useEffect } from 'react';

// Define the TypeScript interface for a Post object
// This ensures our component knows what kind of data to expect
interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  category_name: string;
}

const Home: React.FC = () => {
  // State to store the array of posts
  const [posts, setPosts] = useState<Post[]>([]);
  // State to show a loading message while fetching data
  const [loading, setLoading] = useState<boolean>(true);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect hook runs after the component mounts
  useEffect(() => {
    // This async function fetches the posts from your PHP API
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/posts`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // The posts are inside the 'data' property of the JSON from our PHP script
        setPosts(data.data || []); // Use an empty array if data is null

      } catch (e: any) {
        // If an error occurs, save the error message to state
        setError(e.message);
      } finally {
        // Once the fetch is complete (success or fail), stop loading
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // The empty array [] ensures this effect runs only once

  // --- Render UI based on state ---
  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Latest Blog Posts</h1>
      {posts.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <h2>{post.title}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: '12px' }}>
                <span><strong>Category:</strong> {post.category_name}</span>
                <span><strong>By:</strong> {post.author}</span>
              </div>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default Home;