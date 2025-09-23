// Booking management utilities for Supabase
import { supabase } from './supabase.client'

export interface Booking {
    id: string
    clientId: string
    providerId: string
    serviceId: string
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
    title: string
    description?: string
    budget: number
    startDate?: string
    endDate?: string
    estimatedHours?: number
    actualHours?: number
    clientNotes?: string
    providerNotes?: string
    createdAt: string
    updatedAt: string
    // Related data
    service?: {
        id: string
        title: string
        description: string
        price: number
        priceType: string
    }
    client?: {
        id: string
        fullName: string
        email: string
        phone?: string
        location?: string
    }
    provider?: {
        id: string
        fullName: string
        email: string
        phone?: string
        location?: string
        rating: number
    }
}

export const bookingsStorage = {
    // Create a new booking
    create: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([{
                    client_id: bookingData.clientId,
                    provider_id: bookingData.providerId,
                    service_id: bookingData.serviceId,
                    status: bookingData.status,
                    title: bookingData.title,
                    description: bookingData.description,
                    budget: bookingData.budget,
                    start_date: bookingData.startDate,
                    end_date: bookingData.endDate,
                    estimated_hours: bookingData.estimatedHours,
                    actual_hours: bookingData.actualHours,
                    client_notes: bookingData.clientNotes,
                    provider_notes: bookingData.providerNotes
                }])
                .select(`
                    *,
                    services!inner(id, title, description, price, price_type),
                    user_profiles!bookings_client_id_fkey(id, full_name, email, phone, location),
                    user_profiles!bookings_provider_id_fkey(id, full_name, email, phone, location, rating)
                `)
                .single()

            if (error) {
                console.error('Error creating booking:', error)
                throw error
            }

            return {
                id: data.id,
                clientId: data.client_id,
                providerId: data.provider_id,
                serviceId: data.service_id,
                status: data.status,
                title: data.title,
                description: data.description,
                budget: data.budget,
                startDate: data.start_date,
                endDate: data.end_date,
                estimatedHours: data.estimated_hours,
                actualHours: data.actual_hours,
                clientNotes: data.client_notes,
                providerNotes: data.provider_notes,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                service: {
                    id: data.services.id,
                    title: data.services.title,
                    description: data.services.description,
                    price: data.services.price,
                    priceType: data.services.price_type
                },
                client: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location
                },
                provider: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location,
                    rating: data.user_profiles.rating
                }
            }
        } catch (error) {
            console.error('Error creating booking:', error)
            throw error
        }
    },

    // Get bookings by user (client or provider)
    getByUser: async (userId: string, userType: 'client' | 'provider'): Promise<Booking[]> => {
        try {
            const column = userType === 'client' ? 'client_id' : 'provider_id'
            
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    services!inner(id, title, description, price, price_type),
                    user_profiles!bookings_client_id_fkey(id, full_name, email, phone, location),
                    user_profiles!bookings_provider_id_fkey(id, full_name, email, phone, location, rating)
                `)
                .eq(column, userId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching bookings:', error)
                throw error
            }

            return data.map(booking => ({
                id: booking.id,
                clientId: booking.client_id,
                providerId: booking.provider_id,
                serviceId: booking.service_id,
                status: booking.status,
                title: booking.title,
                description: booking.description,
                budget: booking.budget,
                startDate: booking.start_date,
                endDate: booking.end_date,
                estimatedHours: booking.estimated_hours,
                actualHours: booking.actual_hours,
                clientNotes: booking.client_notes,
                providerNotes: booking.provider_notes,
                createdAt: booking.created_at,
                updatedAt: booking.updated_at,
                service: {
                    id: booking.services.id,
                    title: booking.services.title,
                    description: booking.services.description,
                    price: booking.services.price,
                    priceType: booking.services.price_type
                },
                client: {
                    id: booking.user_profiles.id,
                    fullName: booking.user_profiles.full_name,
                    email: booking.user_profiles.email,
                    phone: booking.user_profiles.phone,
                    location: booking.user_profiles.location
                },
                provider: {
                    id: booking.user_profiles.id,
                    fullName: booking.user_profiles.full_name,
                    email: booking.user_profiles.email,
                    phone: booking.user_profiles.phone,
                    location: booking.user_profiles.location,
                    rating: booking.user_profiles.rating
                }
            }))
        } catch (error) {
            console.error('Error fetching bookings:', error)
            return []
        }
    },

    // Update booking status
    updateStatus: async (bookingId: string, status: Booking['status'], notes?: string): Promise<Booking | null> => {
        try {
            const updates: any = { status }
            if (notes) {
                updates.provider_notes = notes
            }

            const { data, error } = await supabase
                .from('bookings')
                .update(updates)
                .eq('id', bookingId)
                .select(`
                    *,
                    services!inner(id, title, description, price, price_type),
                    user_profiles!bookings_client_id_fkey(id, full_name, email, phone, location),
                    user_profiles!bookings_provider_id_fkey(id, full_name, email, phone, location, rating)
                `)
                .single()

            if (error) {
                console.error('Error updating booking:', error)
                throw error
            }

            return {
                id: data.id,
                clientId: data.client_id,
                providerId: data.provider_id,
                serviceId: data.service_id,
                status: data.status,
                title: data.title,
                description: data.description,
                budget: data.budget,
                startDate: data.start_date,
                endDate: data.end_date,
                estimatedHours: data.estimated_hours,
                actualHours: data.actual_hours,
                clientNotes: data.client_notes,
                providerNotes: data.provider_notes,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                service: {
                    id: data.services.id,
                    title: data.services.title,
                    description: data.services.description,
                    price: data.services.price,
                    priceType: data.services.price_type
                },
                client: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location
                },
                provider: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location,
                    rating: data.user_profiles.rating
                }
            }
        } catch (error) {
            console.error('Error updating booking:', error)
            throw error
        }
    },

    // Get booking by ID
    getById: async (bookingId: string): Promise<Booking | null> => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    services!inner(id, title, description, price, price_type),
                    user_profiles!bookings_client_id_fkey(id, full_name, email, phone, location),
                    user_profiles!bookings_provider_id_fkey(id, full_name, email, phone, location, rating)
                `)
                .eq('id', bookingId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    return null
                }
                console.error('Error fetching booking:', error)
                throw error
            }

            return {
                id: data.id,
                clientId: data.client_id,
                providerId: data.provider_id,
                serviceId: data.service_id,
                status: data.status,
                title: data.title,
                description: data.description,
                budget: data.budget,
                startDate: data.start_date,
                endDate: data.end_date,
                estimatedHours: data.estimated_hours,
                actualHours: data.actual_hours,
                clientNotes: data.client_notes,
                providerNotes: data.provider_notes,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                service: {
                    id: data.services.id,
                    title: data.services.title,
                    description: data.services.description,
                    price: data.services.price,
                    priceType: data.services.price_type
                },
                client: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location
                },
                provider: {
                    id: data.user_profiles.id,
                    fullName: data.user_profiles.full_name,
                    email: data.user_profiles.email,
                    phone: data.user_profiles.phone,
                    location: data.user_profiles.location,
                    rating: data.user_profiles.rating
                }
            }
        } catch (error) {
            console.error('Error fetching booking:', error)
            return null
        }
    }
}
