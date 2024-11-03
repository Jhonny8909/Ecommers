import React, { useState } from 'react';
import { databases, storage, databaseID, collectionID, bucketID } from '../appwriteConfig';

const IdeaForm = ({ addIdea }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // Limitar a 5 MB
      alert('File size must be less than 5MB.');
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Limpiar el contenido y verificar la longitud
    const trimmedContent = content.trim();
    
    if (trimmedContent.length === 0 || trimmedContent.length > 500) {
      alert("Content must be a valid string and no longer than 500 characters.");
      return; // Detener el envío si el contenido es inválido
    }
  
    let imageId = null;
  
    // Si hay una imagen, sube a Appwrite
    if (image) {
      try {
        const response = await storage.createFile(bucketID, 'unique()', image);
        imageId = response.$id; // Almacena el ID de la imagen
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Error uploading image: " + error.message);
        return; // Detener el envío si hay un error con la imagen
      }
    }
  
    // Agrega la idea a la base de datos
    try {
      console.log('Content to save:', trimmedContent);
      await databases.createDocument(databaseID, collectionID, 'unique()', { content: trimmedContent, imageId });
      addIdea({ content: trimmedContent, imageId }); // Actualiza el estado en el componente padre
      setContent(''); // Limpia el campo de contenido
      setImage(null); // Limpia el archivo de imagen
    } catch (error) {
      console.error('Error saving idea:', error);
      alert("Error saving idea: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Enter your idea" 
        required 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      {image && <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Idea'}
      </button>
    </form>
  );
};

export default IdeaForm;