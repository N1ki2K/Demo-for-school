import React, { useState } from 'react';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState(''); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 

    const newPost = {
      title,
      body,
      author,
      category_id: 1 
    };

    try {
      const response = await fetch('http://localhost/my-cms-api/api/posts/create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost), 
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      setMessage(result.message); 

      setTitle('');
      setBody('');
      setAuthor('');

    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', marginTop: '2rem' }}>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Content:</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Create Post</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default CreatePost;