import { Link } from 'react-router-dom';

function BlogCard({ blog = {} }) {
  const { 
    id = '', 
    title = 'Untitled', 
    author = 'Unknown', 
    date = 'N/A', 
    excerpt = '', 
    image = '', 
    category = 'General' 
  } = blog;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img 
        src={image} 
        alt={title || 'Blog Image'} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {category}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            By {author} | {date}
          </div>
          <Link to={`/blogs/${id}`} className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
            Read More 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
