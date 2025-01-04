import React, { useState, useCallback } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!'); 
    redirectToLogin(); 
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage(data.message);
        redirectToArticles();
      } else {
        setMessage(data.message || 'Invalid login attempt');
      }
    } catch (err) {
      setMessage('Login failed. Please try again.');
    } finally {
      setSpinnerOn(false);
    }
  };
  

  const getArticles = useCallback(async () => {
    setMessage('');
    setSpinnerOn(true); // Turn on spinner
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('http://localhost:9000/api/articles', {
        method: 'GET',
        headers: { Authorization: token },
      });
      const data = await response.json();
  
      if (response.ok) {
        setArticles(data.articles); // Update articles state
        setMessage(data.message); // Display success message
      } else {
        setMessage(data.message || 'Failed to fetch articles');
        if (response.status === 401) redirectToLogin(); // Handle unauthorized access
      }
    } catch (err) {
      setMessage('An error occurred while fetching articles');
    } finally {
      setSpinnerOn(false); // Turn off spinner
    }
  }, []);

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(article),
      });

      const data = await response.json();

      if (response.ok) {
        setArticles([...articles, data.article]); // Add new article to state
        setMessage(data.message); // Set success message
      } else {
        setMessage(data.message || 'Failed to create article');
      }
    } catch (err) {
      setMessage('An error occurred while posting the article');
    } finally {
      setSpinnerOn(false);
    }
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(article),
      });

      const data = await response.json();

      if (response.ok) {
        setArticles(
          articles.map((art) =>
            art.article_id === article_id ? data.article : art
          )
        );
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Failed to update article');
      }
    } catch (err) {
      setMessage('An error occurred while updating the article');
    } finally {
      setSpinnerOn(false);
    }
  }

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (response.ok) {
        setArticles(articles.filter((art) => art.article_id !== article_id));
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Failed to delete article');
      }
    } catch (err) {
      setMessage('An error occurred while deleting the article');
    } finally {
      setSpinnerOn(false);
    }  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={articles.find(
                    (art) => art.article_id === currentArticleId
                  )}
              />
              <Articles 
                articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
