// Image upload utilities for Supabase Storage
import { supabase } from './supabase.client'

export interface UploadedImage {
    url: string
    file?: File
    preview?: string
}

export interface UploadProgress {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'error'
    error?: string
}

/**
 * Compress/resize image before upload (client-side)
 * @param file - The image file to compress
 * @param maxWidth - Maximum width (default: 1920)
 * @param maxHeight - Maximum height (default: 1920)
 * @param quality - JPEG quality 0-1 (default: 0.85)
 * @returns Compressed File object
 */
export const compressImage = async (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.85
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height
                        height = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'))
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'))
                            return
                        }
                        const compressedFile = new File(
                            [blob],
                            file.name,
                            { type: file.type, lastModified: Date.now() }
                        )
                        resolve(compressedFile)
                    },
                    file.type,
                    quality
                )
            }
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Upload image to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'services', 'profiles')
 * @param userId - The user ID for organizing files
 * @param onProgress - Optional progress callback
 * @param compress - Whether to compress the image before upload (default: true)
 * @returns The public URL of the uploaded image
 */
export const uploadImageToStorage = async (
    file: File,
    folder: string = 'services',
    userId?: string,
    onProgress?: (progress: number) => void,
    compress: boolean = true
): Promise<string> => {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image')
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 5MB')
        }

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('User must be authenticated to upload images')
        }

        // Use provided userId or current user's ID
        const uploadUserId = userId || user.id

        // Compress image if enabled and file is large
        let fileToUpload = file
        if (compress && file.size > 500 * 1024) { // Compress if > 500KB
            try {
                fileToUpload = await compressImage(file)
                if (onProgress) onProgress(30) // Compression progress
            } catch (compressionError) {
                console.warn('Image compression failed, uploading original:', compressionError)
                // Continue with original file if compression fails
            }
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop() || 'jpg'
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 15)
        const fileName = `${timestamp}_${randomStr}.${fileExt}`
        const filePath = `${folder}/${uploadUserId}/${fileName}`

        if (onProgress) onProgress(50) // Upload started

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('service-images')
            .upload(filePath, fileToUpload, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Error uploading image:', error)
            // Handle specific errors
            if (error.message.includes('already exists')) {
                throw new Error('An image with this name already exists')
            } else if (error.message.includes('not found')) {
                throw new Error('Storage bucket not found. Please set up the storage bucket first.')
            } else if (error.message.includes('permission')) {
                throw new Error('Permission denied. Please check your storage policies.')
            }
            throw error
        }

        if (onProgress) onProgress(90) // Upload completed

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('service-images')
            .getPublicUrl(filePath)

        if (onProgress) onProgress(100) // Done

        return urlData.publicUrl
    } catch (error: any) {
        console.error('Error in uploadImageToStorage:', error)
        throw new Error(error.message || 'Failed to upload image')
    }
}

/**
 * Delete image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @returns True if successful
 */
export const deleteImageFromStorage = async (url: string): Promise<boolean> => {
    try {
        // Extract file path from URL
        // URL format: https://[project].supabase.co/storage/v1/object/public/service-images/services/[userId]/[filename]
        const urlParts = url.split('/')
        const serviceImagesIndex = urlParts.findIndex(part => part === 'service-images')
        
        if (serviceImagesIndex === -1) {
            console.error('Invalid image URL format')
            return false
        }

        // Get path after 'service-images'
        const filePath = urlParts.slice(serviceImagesIndex + 1).join('/')

        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error('User must be authenticated to delete images')
            return false
        }

        // Verify the file belongs to the current user (security check)
        const pathParts = filePath.split('/')
        if (pathParts.length >= 2 && pathParts[0] === 'services' && pathParts[1] !== user.id) {
            console.error('User does not have permission to delete this image')
            return false
        }

        const { error } = await supabase.storage
            .from('service-images')
            .remove([filePath])

        if (error) {
            console.error('Error deleting image:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error in deleteImageFromStorage:', error)
        return false
    }
}

/**
 * Create a preview URL from a File object
 * @param file - The file to create a preview for
 * @returns Object URL for preview
 */
export const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file)
}

/**
 * Revoke a preview URL to free memory
 * @param url - The object URL to revoke
 */
export const revokeImagePreview = (url: string): void => {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
    }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns Object with isValid and error message
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!file.type.startsWith('image/') || !allowedTypes.includes(file.type.toLowerCase())) {
        return { 
            isValid: false, 
            error: `File type not supported. Please use: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}` 
        }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: `Image size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        }
    }

    // Check if file is empty
    if (file.size === 0) {
        return { isValid: false, error: 'File is empty' }
    }

    return { isValid: true }
}

/**
 * Upload multiple images with progress tracking
 * @param files - Array of files to upload
 * @param folder - The folder path in storage
 * @param userId - The user ID for organizing files
 * @param onProgress - Progress callback for each file
 * @returns Array of uploaded image URLs
 */
export const uploadMultipleImages = async (
    files: File[],
    folder: string = 'services',
    userId?: string,
    onProgress?: (file: File, progress: number, status: string) => void
): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
        try {
            if (onProgress) onProgress(file, 0, 'uploading')
            const url = await uploadImageToStorage(
                file,
                folder,
                userId,
                (progress) => {
                    if (onProgress) onProgress(file, progress, 'uploading')
                }
            )
            if (onProgress) onProgress(file, 100, 'completed')
            return url
        } catch (error: any) {
            if (onProgress) onProgress(file, 0, 'error')
            console.error(`Error uploading ${file.name}:`, error)
            throw new Error(`Failed to upload ${file.name}: ${error.message}`)
        }
    })

    return Promise.all(uploadPromises)
}

