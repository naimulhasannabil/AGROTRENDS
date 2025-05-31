function TeamMember({ member }) {
  const { name, role, image } = member
  
  return (
    <div className="text-center">
      <div className="mx-auto h-32 w-32 rounded-full bg-primary-100 p-2 mb-4">
        <div className="h-full w-full rounded-full bg-primary-200 flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary-600">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  )
}

export default TeamMember