import React, { useState } from 'react';
import { databases, storage, databaseID, collectionID } from '../appwriteConfig';

const IdeaForm = ({ addIdea }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageId = null;

    // Si hay una imagen, sube a Appwrite
    if (image) {
      try {
        const response = await storage.createFile(databaseID, 'unique()', image);
        imageId = response.$id; // Almacena el ID de la imagen
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Error uploading image: " + error.message);
        return; // Detener el envío si hay un error con la imagen
      }
    }

    // Agrega la idea a la base de datos
    try {
      await databases.createDocument(databaseID, collectionID, 'unique()', { content, imageId });
      addIdea({ content, imageId }); // Actualiza el estado en el componente padre
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
      <button type="submit">Add Idea</button>
    </form>
  );
};

export default IdeaForm;