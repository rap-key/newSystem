import React from 'react'
import { HashRouter , Route, Routes , Navigate } from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
  const isLogin = localStorage.getItem("token")?<NewsSandBox></NewsSandBox>:<Navigate to="/login"></Navigate>
  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login/>} />
        {/* <Route path='/' element={<NewsSandBox/>} /> */}
        <Route path='*' element={isLogin} />
      </Routes>
    </HashRouter>
  )
}
