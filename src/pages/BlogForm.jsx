import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { notification } from 'antd'
import { useCreateBlog, useUpdateBlog, useGetBlog, useGetCategories } from '../services/query/blog'
import { useQueryClient } from '@tanstack/react-query'

function BlogForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { id } = useParams() // For editing
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    categoryId: ''
  })
  
  // Image upload states
  const [_selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 60, x: 0, y: 0, aspect: 1 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)
  const quillRef = useRef(null)

  // Fetch blog data using React Query (for editing)
  const { data: blogData, isLoading: blogLoading } = useGetBlog(id, {
    enabled: !!id,
    retry: false
  })
  
  // Fetch categories using React Query
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories(
    0,
    50,
    'categoryName',
    'asc'
  )
  
  // Process categories when data is available
  useEffect(() => {
    if (categoriesData?.data) {
      try {
        console.log('Fetched categories:', categoriesData.data)
        
        // Handle both array and paginated response
        const responseData = categoriesData.data
        const categoriesArray = Array.isArray(responseData) 
          ? responseData 
          : (responseData.payload?.content || responseData.payload || responseData.content || [])
        
        setCategories(categoriesArray)
        
        if (categoriesArray.length === 0) {
          setError('No categories found. Please contact administrator.')
        }
      } catch (err) {
        console.error('Error processing categories:', err)
        setError('Failed to load categories')
      }
    }
  }, [categoriesData])
  
  // Process blog data when available (for editing)
  useEffect(() => {
    if (blogData?.data && id) {
      try {
        const data = blogData.data.payload || blogData.data.data || blogData.data
        
        // Extract author ID from nested structure
        const blogAuthorId = data.author?.user?.id || data.authorUserId || data.author?.id
        
        // Check if user is the author of this blog
        if (blogAuthorId !== user.id) {
          notification.error({
            title: 'Unauthorized',
            description: 'You can only edit your own blogs',
            placement: 'topRight'
          })
          navigate('/blogs')
          return
        }
        
        // Extract category ID from nested structure
        const categoryId = data.category?.id || data.categoryId
        
        setFormData({
          title: data.title || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '',
          categoryId: categoryId || ''
        })
      } catch (err) {
        console.error('Error processing blog data:', err)
        setError('Failed to load blog')
      }
    }
  }, [blogData, id, user, navigate])
  
  const { mutate: createBlogMutation } = useCreateBlog({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notification.success({
        message: 'Success',
        description: 'Blog created successfully!',
        placement: 'topRight'
      })
      navigate('/blogs')
    },
    onError: (error) => {
      console.error('Error creating blog:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create blog. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  })
  
  const { mutate: updateBlogMutation } = useUpdateBlog({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blog', id] })
      notification.success({
        message: 'Success',
        description: 'Blog updated successfully!',
        placement: 'topRight'
      })
      navigate('/blogs')
    },
    onError: (error) => {
      console.error('Error updating blog:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update blog. Please try again.'
      setError(errorMsg)
      setLoading(false)
    }
  })

  // Quill editor modules
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        ['blockquote', 'code-block']
      ],
      handlers: {
        image: () => {
          fileInputRef.current?.click()
        }
      }
    }
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ]

  useEffect(() => {
    console.log('BlogForm - Current user:', user)
    console.log('BlogForm - userType:', user?.userType)
    
    // Check if user is an author (userType array includes 'AUTHOR')
    const isAuthor = user?.userType?.includes('AUTHOR')
    console.log('BlogForm - isAuthor:', isAuthor)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(file)
        setImagePreview(reader.result)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return null

    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9)
    })
  }

  const handleUploadImage = async () => {
    try {
      setUploading(true)
      setError(null)
      
      const croppedBlob = await getCroppedImg()
      if (!croppedBlob) {
        setError('Failed to crop image')
        return
      }

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(croppedBlob)
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1]
        
        // Upload to ImgBB
        const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '3df18933133843953dea4ab8c5859e84'
        
        try {
          const formData = new FormData()
          formData.append('image', base64data)
          
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
          })
          
          const result = await response.json()
          
          if (result.success) {
            setFormData(prev => ({
              ...prev,
              imageUrl: result.data.url
            }))
            
            setShowCropModal(false)
            setSelectedImage(null)
            setImagePreview(null)
            notification.success({
              message: 'Success',
              description: 'Image uploaded successfully!',
              placement: 'topRight'
            })
          } else {
            setError('Failed to upload image to ImgBB. Please check your API key.')
          }
        } catch (uploadError) {
          console.error('ImgBB upload error:', uploadError)
          setError('Failed to upload image to ImgBB. Please check your API key.')
        }
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }))
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (formData.title.length > 255) {
      setError('Title must be less than 255 characters')
      return
    }
    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }
    if (!formData.categoryId) {
      setError('Please select a category')
      return
    }
    if (formData.imageUrl && formData.imageUrl.length > 255) {
      setError('Image URL is too long. Please use a shorter URL.')
      return
    }

    setLoading(true)
    setError(null)

    if (id) {
      // Update existing blog
      const updateData = {
        blogId: id,
        title: formData.title.trim(),
        content: formData.content,
        imageUrl: formData.imageUrl?.trim() || '',
        categoryId: parseInt(formData.categoryId)
      }
      console.log('Updating blog with data:', updateData)
      console.log('Field lengths - title:', updateData.title.length, 'imageUrl:', updateData.imageUrl.length)
      updateBlogMutation(updateData)
    } else {
      // Create new blog
      const createData = {
        authorUserId: user.id,
        categoryId: parseInt(formData.categoryId),
        title: formData.title.trim(),
        content: formData.content,
        imageUrl: formData.imageUrl?.trim() || ''
      }
      
      console.log('Creating blog with data:', createData)
      console.log('Field lengths - title:', createData.title.length, 'imageUrl:', createData.imageUrl.length, 'content:', createData.content.length)
      createBlogMutation(createData)
    }
  }

  if (blogLoading || (id && !blogData)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {id ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update your blog post' : 'Share your knowledge with the community'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            {/* Title */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <span className={`text-xs ${formData.title.length > 255 ? 'text-red-600' : 'text-gray-500'}`}>
                  {formData.title.length}/255
                </span>
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                maxLength={255}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              {categoriesLoading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : (
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id || category.categoryId} value={category.id || category.categoryId}>
                      {category.categoryName || category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Image
              </label>
              
              <div className="flex flex-col gap-4">
                {/* Upload Button */}
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Upload Image</span>
                  </label>
                  
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="relative">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Current image
                    </div>
                  </div>
                )}

                {/* Manual URL Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Or paste image URL</span>
                    {formData.imageUrl && (
                      <span className={`text-xs ${formData.imageUrl.length > 255 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                        {formData.imageUrl.length}/255
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    maxLength={255}
                    className={`w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      formData.imageUrl.length > 255 ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formData.imageUrl.length > 255 && (
                    <p className="mt-1 text-xs text-red-600">Image URL is too long (max 255 characters)</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                  className="bg-white"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {formData.content.replace(/<[^>]*>/g, '').length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(id ? `/blogs/${id}` : '/blogs')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : id ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Crop Image</h3>
                <button
                  onClick={() => {
                    setShowCropModal(false)
                    setImagePreview(null)
                    setSelectedImage(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    ref={imgRef}
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCropModal(false)
                    setImagePreview(null)
                    setSelectedImage(null)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload & Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogForm