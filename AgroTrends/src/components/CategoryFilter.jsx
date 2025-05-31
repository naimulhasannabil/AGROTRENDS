function CategoryFilter({ categories = [], activeCategory = '', onCategoryChange = () => {} }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id || category.name || Math.random()}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full transition-colors ${
            activeCategory === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
