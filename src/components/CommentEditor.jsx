import { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import PropTypes from 'prop-types'

function CommentEditor({ 
  value, 
  onChange, 
  onSubmit, 
  onCancel, 
  placeholder = "Write your comment...",
  submitLabel = "Post Comment",
  showCancel = false,
  autoFocus = false,
  rows = 3,
  size = 'medium', // 'small', 'medium', 'large'
  emojiPosition = 'bottom' // 'top' or 'bottom'
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef(null)
  const emojiPickerRef = useRef(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const handleEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const before = text.substring(0, start)
    const after = text.substring(end)
    const newText = before + emojiObject.emoji + after
    
    onChange({ target: { value: newText } })
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + emojiObject.emoji.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (value.trim()) {
        onSubmit(e)
      }
    }
  }

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  const buttonSizeClasses = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-5 py-2 text-base'
  }

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-3 py-2 resize-none focus:outline-none rounded-t-lg ${sizeClasses[size]}`}
          rows={rows}
          autoFocus={autoFocus}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center space-x-2">
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-200 rounded-full transition-colors"
              title="Add emoji"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Character count hint */}
            {value.length > 0 && (
              <span className="text-xs text-gray-500">
                {value.length} characters
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={`bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors ${buttonSizeClasses[size]}`}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!value.trim()}
              className={`bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]}`}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef} 
          className={`absolute z-50 shadow-lg ${
            emojiPosition === 'top' ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
            searchPlaceholder="Search emoji..."
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* Keyboard hint */}
      <p className="mt-1 text-xs text-gray-500">
        Press Ctrl+Enter to submit
      </p>
    </div>
  )
}

CommentEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  placeholder: PropTypes.string,
  submitLabel: PropTypes.string,
  showCancel: PropTypes.bool,
  autoFocus: PropTypes.bool,
  rows: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  emojiPosition: PropTypes.oneOf(['top', 'bottom'])
}

export default CommentEditor
