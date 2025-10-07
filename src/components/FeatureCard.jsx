function FeatureCard({ feature }) {
  const { title, description, icon: Icon } = feature
  
  return (
    <div className="bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-md">
      <div className="mb-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default FeatureCard