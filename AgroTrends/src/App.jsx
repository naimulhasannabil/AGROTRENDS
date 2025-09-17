import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Categories from './pages/Categories'
import Crops from './pages/Crops'
import Livestock from './pages/Livestock'
import Fisheries from './pages/Fisheries'
import Technologies from './pages/Technologies'
import AIAssistant from './pages/AIAssistant'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Products from './pages/Products'
import Courses from './pages/Courses'
import QA from './pages/QA'
import Events from './pages/Events'
import AIChat from './components/AIChat'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="categories" element={<Categories />} />
          <Route path="crops" element={<Crops />} />
          <Route path="livestock" element={<Livestock />} />
          <Route path="fisheries" element={<Fisheries />} />
          <Route path="technologies" element={<Technologies />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="products" element={<Products />} />
          <Route path="courses" element={<Courses />} />
          <Route path="qa" element={<QA />} />
          <Route path="events" element={<Events />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
      <AIChat />
    </>
  )
}

export default App