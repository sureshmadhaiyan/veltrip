<template>
  <div class="photo-upload">
    <label v-if="label" :for="inputId" class="upload-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <div class="upload-container">
      <div v-if="previewUrl" class="preview-section" @click="triggerFileInput">
        <img 
          :src="previewUrl" 
          alt="Preview" 
          class="preview-image"
          @error="handleImageError"
        />
        <button type="button" @click.stop="removePhoto" class="remove-btn" title="Remove photo">×</button>
        <div class="preview-overlay">
          <span class="preview-text">Click to change</span>
        </div>
        <input
          :id="inputId"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          ref="fileInputRef"
          class="file-input-hidden"
        />
      </div>
      
      <div v-else class="upload-area" :class="{ 'is-dragging': isDragging }">
        <input
          :id="inputId"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @dragover.prevent
          @drop.prevent="handleDrop"
          ref="fileInputRef"
          class="file-input"
        />
        <div class="upload-content">
          <span class="upload-icon">📷</span>
          <p class="upload-text">Click to upload or drag and drop</p>
          <p class="upload-hint">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>
    </div>
    
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="progress-text">Uploading... {{ uploadProgress }}%</span>
    </div>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <small v-if="hint" class="hint-text">{{ hint }}</small>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../api/company'

const fileInputRef = ref(null)
const inputId = ref(`photo-upload-${Math.random().toString(36).substr(2, 9)}`)

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Photo',
  },
  hint: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  uploadType: {
    type: String,
    default: 'driver-photo', // driver-photo, passenger-photo, vehicle-photo, company-logo
  },
})

const emit = defineEmits(['update:modelValue'])

const previewUrl = computed(() => {
  // Prioritize local preview (immediate), then modelValue (uploaded or existing)
  if (localPreviewUrl.value) {
    return localPreviewUrl.value
  }
  // Ensure modelValue is a full URL if it's a relative path
  if (props.modelValue) {
    const value = props.modelValue.trim()
    if (!value) return null
    
    // If it's already a full URL
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }
    
    // If it starts with /uploads, construct full URL
    if (value.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      return `${apiUrl}${value}`
    }
    
    // If it doesn't start with /, add /uploads/drivers/ or appropriate path
    if (!value.startsWith('/')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      // Try to determine the upload type from the path
      if (value.includes('driver')) {
        return `${apiUrl}/uploads/drivers/${value}`
      } else if (value.includes('passenger')) {
        return `${apiUrl}/uploads/passengers/${value}`
      } else if (value.includes('vehicle')) {
        return `${apiUrl}/uploads/vehicles/${value}`
      } else if (value.includes('company')) {
        return `${apiUrl}/uploads/companies/${value}`
      }
      return `${apiUrl}${value.startsWith('/') ? '' : '/'}${value}`
    }
    
    // Default: prepend API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${apiUrl}${value}`
  }
  return null
})

const handleImageError = (event) => {
  console.error('Image load error:', event, 'URL:', event.target.src)
  // If image fails to load, try to construct URL differently
  if (props.modelValue && !props.modelValue.startsWith('http')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const value = props.modelValue.trim()
    let newUrl = ''
    
    if (value.startsWith('/uploads')) {
      newUrl = `${apiUrl}${value}`
    } else if (value.startsWith('/')) {
      newUrl = `${apiUrl}${value}`
    } else {
      // Try to guess the upload type
      const uploadType = props.uploadType || 'driver-photo'
      const folderMap = {
        'driver-photo': 'drivers',
        'passenger-photo': 'passengers',
        'vehicle-photo': 'vehicles',
        'company-logo': 'companies'
      }
      const folder = folderMap[uploadType] || 'drivers'
      newUrl = `${apiUrl}/uploads/${folder}/${value}`
    }
    
    if (newUrl && newUrl !== event.target.src) {
      event.target.src = newUrl
    }
  }
}

// Watch for changes in modelValue to update preview
watch(() => props.modelValue, (newValue) => {
  if (newValue && !localPreviewUrl.value) {
    // Force recomputation of preview URL
    console.log('Photo URL updated:', newValue)
  }
})

const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')
const localPreviewUrl = ref('')

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  // Validate file type first
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Invalid file type. Only images are allowed.'
    return
  }
  
  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }
  
  error.value = ''
  
  // Show local preview immediately
  const reader = new FileReader()
  reader.onload = (e) => {
    localPreviewUrl.value = e.target.result
  }
  reader.onerror = () => {
    error.value = 'Failed to read file'
  }
  reader.readAsDataURL(file)
  
  // Then upload
  uploadFile(file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  
  if (!file) {
    error.value = 'No file dropped'
    return
  }
  
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }
  
  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }
  
  error.value = ''
  
  // Show local preview immediately
  const reader = new FileReader()
  reader.onload = (e) => {
    localPreviewUrl.value = e.target.result
  }
  reader.onerror = () => {
    error.value = 'Failed to read file'
  }
  reader.readAsDataURL(file)
  
  // Then upload
  uploadFile(file)
}

const uploadFile = async (file) => {
  uploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('file', file)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await api.post(`/upload/${props.uploadType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      },
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Get full URL - use relative URL if same origin, otherwise use full URL
    const photoUrl = response.data.url.startsWith('http') 
      ? response.data.url 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${response.data.url}`
    
    emit('update:modelValue', photoUrl)
    localPreviewUrl.value = '' // Clear local preview after upload
    
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (err) {
    console.error('Upload error:', err)
    error.value = err.response?.data?.message || 'Failed to upload photo'
    uploading.value = false
    uploadProgress.value = 0
    // Keep local preview even if upload fails, so user can see what they selected
  }
}

const triggerFileInput = () => {
  // Try to use ref first, then fallback to getElementById
  if (fileInputRef.value) {
    fileInputRef.value.click()
  } else {
    const input = document.getElementById(inputId.value)
    if (input) {
      input.click()
    }
  }
}

const removePhoto = () => {
  emit('update:modelValue', '')
  localPreviewUrl.value = ''
  error.value = ''
  // Reset file input
  const input = document.getElementById(inputId.value)
  if (input) {
    input.value = ''
  }
}
</script>

<style scoped>
.photo-upload {
  margin-bottom: 1.5rem;
}

.upload-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.upload-container {
  position: relative;
}

.preview-section {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  text-align: center;
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-section:hover .preview-overlay {
  opacity: 1;
}

.preview-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  display: block;
  cursor: pointer;
  transition: transform 0.3s;
}

.preview-image:hover {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #dc2626;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f9fafb;
  position: relative;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f3f4f6;
}

.upload-area.is-dragging {
  border-color: #667eea;
  background: #eef2ff;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-input-hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.upload-text {
  font-weight: 600;
  color: #374151;
  margin: 0.5rem 0;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.upload-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.hint-text {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>

