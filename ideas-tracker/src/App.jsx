import React, { useEffect, useState } from 'react';
import { account, databases, databaseID, collectionID } from './appwriteConfig';
import IdeaForm from './components/IdeaForm';
import IdeasList from './components/IdeasList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [showRegister, setShowRegister] = useState(false); // Definir el estado `showRegister`

  const toggleForm = () => setShowRegister(!showRegister);

  const loginUser = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      setUser(session);
      fetchIdeas(); // Llama a fetchIdeas después de iniciar sesión
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed: " + error.message);
    }
  };

  // Obtener ideas desde Appwrite
  const fetchIdeas = async () => {
    try {
      const response = await databases.listDocuments(databaseID, collectionID);
      setIdeas(response.documents);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  // Agregar una nueva idea al Appwrite Database
  const addIdea = async (content,imageId) => {
    try {
      await databases.createDocument(databaseID, collectionID, 'unique()', { content, imageId });
      fetchIdeas(); // Actualiza la lista de ideas después de agregar
      alert("Idea saved successfully!");
    } catch (error) {
      console.error("Error adding idea:", error);
      alert("Error saving idea: " + error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        console.log("User logged in:", currentUser);
      } catch (error) {
        console.log("No user logged in"); // No es necesario mostrar el error si el usuario no está autenticado
      }
    };
    getUser();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <div>
      <h1>Ideas Tracker</h1>
      {!user ? (
        showRegister ? (
          <Register onRegister={() => setShowRegister(false)} />
        ) : (
          <Login loginUser={loginUser} />
        )
      ) : (
        <>
          <IdeaForm addIdea={addIdea} />
          <IdeasList ideas={ideas} setIdeas={setIdeas} />
        </>
      )}
      <button onClick={toggleForm}>
        {showRegister ? 'Have an account? Log in' : 'New user? Register'}
      </button>
    </div>
  );
};

export default App;