import React, { useEffect, useState } from 'react';
import { account, databases, databaseID, collectionID } from './appwriteConfig';
import IdeaForm from './components/IdeaForm';
import IdeasList from './components/IdeasList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');

  const toggleForm = () => setShowRegister(!showRegister);

  const loginUser = async (email, password) => {
    try {
      const session = await account.createEmailSession(email, password);
      setUser(session);
      fetchIdeas();
      setError(''); 
      console.log('User logged in:', session);
    } catch (error) {
      setError('Login failed: ' + error.message);
      console.error("Error logging in:", error);
    }
  };

  const fetchIdeas = async () => {
    try {
      const response = await databases.listDocuments(databaseID, collectionID);
      setIdeas(response.documents);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  const addIdea = async (content, imageId) => {
    try {
      await databases.createDocument(databaseID, collectionID, 'unique()', { content, imageId });
      fetchIdeas();
      alert("Idea saved successfully!");
    } catch (error) {
      console.error("Error adding idea:", error);
      alert("Error saving idea: " + error.message);
    }
  };

  const logoutUser = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Logout failed: " + error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        fetchIdeas();
      } catch {
        console.log("No user logged in");
      }
    };
    getUser();
  }, []);

  const handleRegister = (newUser) => {
    setUser(newUser);
    console.log('User registered:', newUser);
  };

  return (
    <div>
      <h1>Ideas Tracker</h1>
      {!user ? (
        showRegister ? (
          <Register onRegister={handleRegister} />
        ) : (
          <Login loginUser={loginUser} />
        )
      ) : (
        <>
          <IdeaForm addIdea={addIdea} />
          <IdeasList ideas={ideas} setIdeas={setIdeas} />
          <button onClick={logoutUser}>Logout</button> {/* Botón de cierre de sesión */}
        </>
      )}
      <button onClick={toggleForm}>
        {showRegister ? 'Have an account? Log in' : 'New user? Register'}
      </button>
    </div>
  );
};

export default App;
