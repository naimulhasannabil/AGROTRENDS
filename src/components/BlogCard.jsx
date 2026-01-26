import { Link } from 'react-router-dom';

function BlogCard({ blog = {} }) {
  const { 
    blogId,
    id = '', 
    title = 'Untitled', 
    authorName,
    author = 'Unknown', 
    createdDate,
    date = 'N/A', 
    content,
    excerpt = '', 
    imageUrl,
    image = '', 
    categoryName,
    category = 'General' 
  } = blog;
  
  // Helper function to strip HTML tags and decode entities
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Use the correct field names from API
  const displayId = blogId || id
  const displayTitle = title
  // Handle author which can be a string or an object
  const displayAuthor = typeof authorName === 'string' 
    ? authorName 
    : (authorName?.user?.name || authorName?.user?.firstName || (typeof author === 'object' ? (author?.user?.name || author?.user?.firstName || 'Unknown') : author) || 'Unknown')
  const displayDate = createdDate ? new Date(createdDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : date
  // Strip HTML tags and entities from content
  const cleanContent = stripHtml(content || excerpt);
  const displayExcerpt = cleanContent ? cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '') : ''
  const displayImage = imageUrl || image || 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  // Handle categoryName which can be either a string or an object
  const displayCategory = typeof categoryName === 'string' 
    ? categoryName 
    : (categoryName?.categoryName || (typeof category === 'object' && category?.categoryName) || category || 'Uncategorized')
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img 
        src={displayImage} 
        alt={displayTitle || 'Blog Image'} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }}
      />
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {displayCategory}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{displayTitle}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{displayExcerpt}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            By {displayAuthor} | {displayDate}
          </div>
          <Link to={`/blogs/${displayId}`} className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
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
