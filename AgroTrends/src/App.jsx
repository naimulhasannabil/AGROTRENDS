import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Products from './pages/Products'
import Courses from './pages/Courses'
import QA from './pages/QA'
import Events from './pages/Events'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="products" element={<Products />} />
        <Route path="courses" element={<Courses />} />
        <Route path="qa" element={<QA />} />
        <Route path="events" element={<Events />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
      </Route>
    </Routes>
  )
}

export default App