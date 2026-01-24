import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home, { NavigationBar } from './pages/home'
import Article_Creation_Page from './pages/create_article'
import { Login_Register } from './pages/login_register'
import { Loading_Window } from './components/window_templates'
import { useDispatch, useSelector } from 'react-redux'
import { fetchArticles } from './store/slices/articles'
import { fetchUserInfo } from './store/slices/auth'
import { Article_Template_Page } from './pages/article_template_page'

function App() {
  const [count, setCount] = useState(0)
  const d = useDispatch();
  const {user, token} = useSelector((state) => state.auth);
  const {articles, loading, currentArticle} = useSelector((state) => state.articles);

  useEffect(() => {
    if (user && token) {
      console.log("App.jsx - User is logged in:", user);
      d(fetchArticles()).unwrap();
    } else if (!user && token) {
      console.log("App.jsx - No user found but token exists. Possible session issue.");
      d(fetchUserInfo(token)).unwrap();
    }
  }, [user, token, d])

  return (
    <>
      <BrowserRouter>
        <Loading_Window />
        <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/create_article" element={<Article_Creation_Page/>}></Route>
        <Route path={`/edit_article/:${currentArticle?.id}`} element={<Article_Creation_Page isEdit={true} article={currentArticle} />}></Route>
        <Route path='/login' element={<Login_Register loginBool={true} />}></Route>
        <Route path='/register' element={<Login_Register loginBool={false} />}></Route>
        {articles.map(article => (
          <Route key={article.id} path={`/article/${article.id}`} element={
            <Article_Template_Page article={article} />
          }></Route>
        ))}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
