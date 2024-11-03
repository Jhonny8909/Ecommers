import React, { useState, useEffect } from 'react';
import { databases, storage, databaseID, collectionID, bucketID } from '../appwriteConfig';

const IdeasList = ({ ideas, setIdeas }) => {
  const [editingId, setEditingId] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [images, setImages] = useState({});

  const startEditing = (idea) => {
    setEditingId(idea.$id);
    setNewContent(idea.content);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      try {
        for (const idea of ideas) {
          if (idea.imageId) {
            const response = await storage.getFilePreview(bucketID, idea.imageId);
            newImages[idea.imageId] = response.href;
          }
        }
        setImages(newImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (ideas.length) {
      fetchImages();
    }
  }, [ideas]);

  const deleteIdea = async (id) => {
    try {
      await databases.deleteDocument(databaseID, collectionID, id);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.$id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const saveEdit = async (id) => {
    try {
      const updatedIdea = await databases.updateDocument(databaseID, collectionID, id, { content: newContent });
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea.$id === id ? updatedIdea : idea))
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  return (
    <ul>
      {ideas.map((idea) => (
        <li key={idea.$id}>
          {editingId === idea.$id ? (
            <>
              <input
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <button onClick={() => saveEdit(idea.$id)}>Save</button>
            </>
          ) : (
            <>
              <span>{idea.content}</span>
              {idea.imageId && images[idea.imageId] && (
                <img src={images[idea.imageId]} alt="Idea" style={{ width: '100px', height: 'auto' }} />
              )}
              <button onClick={() => startEditing(idea)}>Edit</button>
              <button onClick={() => deleteIdea(idea.$id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default IdeasList;