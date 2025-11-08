// Service management utilities for Supabase
import { supabase } from './supabase.client'

export interface Service {
    id: string
    providerId: string
    title: string
    description: string
    categoryId: string
    categoryName?: string
    priceType: 'hourly' | 'fixed' | 'package'
    price: number
    durationHours?: number
    tags: string[]
    images: string[]
    isActive: boolean
    featured: boolean
    createdAt: string
    updatedAt: string
}

export interface ServiceCategory {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    isActive: boolean
    createdAt: string
}

export const servicesStorage = {
    // Get all service categories
    getCategories: async (): Promise<ServiceCategory[]> => {
        try {
            const { data, error } = await supabase
                .from('service_categories')
                .select('*')
                .eq('is_active', true)
                .order('name')

            if (error) {
                console.error('Error fetching categories:', error)
                throw error
            }

            return data.map(category => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                icon: category.icon,
                isActive: category.is_active,
                createdAt: category.created_at
            }))
        } catch (error) {
            console.error('Error fetching categories:', error)
            return []
        }
    },

    // Create a new service
    create: async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
        try {
            const { data, error } = await supabase
                .from('services')
                .insert([{
                    provider_id: serviceData.providerId,
                    title: serviceData.title,
                    description: serviceData.description,
                    category_id: serviceData.categoryId,
                    price_type: serviceData.priceType,
                    price: serviceData.price,
                    duration_hours: serviceData.durationHours,
                    tags: serviceData.tags,
                    images: serviceData.images,
                    is_active: serviceData.isActive,
                    featured: serviceData.featured
                }])
                .select(`
                    *,
                    service_categories!inner(name, slug)
                `)
                .single()

            if (error) {
                console.error('Error creating service:', error)
                throw error
            }

            return {
                id: data.id,
                providerId: data.provider_id,
                title: data.title,
                description: data.description,
                categoryId: data.category_id,
                categoryName: data.service_categories.name,
                priceType: data.price_type,
                price: data.price,
                durationHours: data.duration_hours,
                tags: data.tags,
                images: data.images,
                isActive: data.is_active,
                featured: data.featured,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            }
        } catch (error) {
            console.error('Error creating service:', error)
            throw error
        }
    },

    // Get services by provider
    getByProvider: async (providerId: string): Promise<Service[]> => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    service_categories!inner(name, slug)
                `)
                .eq('provider_id', providerId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching services:', error)
                throw error
            }

            return data.map(service => ({
                id: service.id,
                providerId: service.provider_id,
                title: service.title,
                description: service.description,
                categoryId: service.category_id,
                categoryName: service.service_categories.name,
                priceType: service.price_type,
                price: service.price,
                durationHours: service.duration_hours,
                tags: service.tags,
                images: service.images,
                isActive: service.is_active,
                featured: service.featured,
                createdAt: service.created_at,
                updatedAt: service.updated_at
            }))
        } catch (error) {
            console.error('Error fetching services:', error)
            return []
        }
    },

    // Get all active services (for public browsing)
    getAllActive: async (categoryId?: string): Promise<Service[]> => {
        try {
            let query = supabase
                .from('services')
                .select(`
                    *,
                    service_categories!inner(name, slug),
                    user_profiles!inner(full_name, rating, completed_jobs, avatar_url)
                `)
                .eq('is_active', true)

            if (categoryId) {
                query = query.eq('category_id', categoryId)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching services:', error)
                throw error
            }

            return data.map(service => ({
                id: service.id,
                providerId: service.provider_id,
                title: service.title,
                description: service.description,
                categoryId: service.category_id,
                categoryName: service.service_categories.name,
                priceType: service.price_type,
                price: service.price,
                durationHours: service.duration_hours,
                tags: service.tags,
                images: service.images,
                isActive: service.is_active,
                featured: service.featured,
                createdAt: service.created_at,
                updatedAt: service.updated_at
            }))
        } catch (error) {
            console.error('Error fetching services:', error)
            return []
        }
    },

    // Update service
    update: async (serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
        try {
            const dbUpdates: any = {}
            if (updates.title !== undefined) dbUpdates.title = updates.title
            if (updates.description !== undefined) dbUpdates.description = updates.description
            if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId
            if (updates.priceType !== undefined) dbUpdates.price_type = updates.priceType
            if (updates.price !== undefined) dbUpdates.price = updates.price
            if (updates.durationHours !== undefined) dbUpdates.duration_hours = updates.durationHours
            if (updates.tags !== undefined) dbUpdates.tags = updates.tags
            if (updates.images !== undefined) dbUpdates.images = updates.images
            if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
            if (updates.featured !== undefined) dbUpdates.featured = updates.featured

            const { data, error } = await supabase
                .from('services')
                .update(dbUpdates)
                .eq('id', serviceId)
                .select(`
                    *,
                    service_categories!inner(name, slug)
                `)
                .single()

            if (error) {
                console.error('Error updating service:', error)
                throw error
            }

            return {
                id: data.id,
                providerId: data.provider_id,
                title: data.title,
                description: data.description,
                categoryId: data.category_id,
                categoryName: data.service_categories.name,
                priceType: data.price_type,
                price: data.price,
                durationHours: data.duration_hours,
                tags: data.tags,
                images: data.images,
                isActive: data.is_active,
                featured: data.featured,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            }
        } catch (error) {
            console.error('Error updating service:', error)
            throw error
        }
    },

    // Delete service
    delete: async (serviceId: string): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', serviceId)

            if (error) {
                console.error('Error deleting service:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('Error deleting service:', error)
            return false
        }
    },

    // Get all services (for admin)
    getAll: async (): Promise<Service[]> => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    service_categories!inner(name, slug),
                    user_profiles!inner(full_name, email)
                `)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching all services:', error)
                throw error
            }

            return data.map(service => ({
                id: service.id,
                providerId: service.provider_id,
                title: service.title,
                description: service.description,
                categoryId: service.category_id,
                categoryName: service.service_categories?.name,
                priceType: service.price_type,
                price: service.price,
                durationHours: service.duration_hours,
                tags: service.tags,
                images: service.images,
                isActive: service.is_active,
                featured: service.featured,
                createdAt: service.created_at,
                updatedAt: service.updated_at
            }))
        } catch (error) {
            console.error('Error fetching all services:', error)
            return []
        }
    }
}
