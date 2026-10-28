import { supabase } from './supabase'
import type { Listing } from './components'
import { puneListings } from './data-pune'

export type ListingFilters = { query?: string; category?: string; collegeName?: string; maxRent?: number; maxTotal?: number; maxDistance?: number; roomType?: string; gender?: string; food?: boolean; laundry?: boolean; wifi?: boolean; minAvailable?: number; recentlyVerified?: boolean; sort?: 'cost' | 'distance' | 'rating' | 'updated' }
export type NaturalSearchFilters = Pick<ListingFilters, 'category' | 'collegeName' | 'maxTotal' | 'maxDistance' | 'gender' | 'food' | 'laundry' | 'wifi'>
export type ListingInput = { title: string; category: 'flat' | 'hostel' | 'pg' | 'mess' | 'laundry'; description: string; address: string; locality: string; city: string; college_name: string; monthly_rent: number; security_deposit: number; electricity_cost?: number | null; food_cost?: number | null; wifi_cost?: number | null; laundry_cost?: number | null; maintenance_cost?: number | null; travel_cost_estimate?: number | null; room_type: string; gender_preference: string; total_capacity: number; available_capacity: number; food_available: boolean; laundry_available: boolean; wifi_available: boolean }

export function requireSupabase() { if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'); return supabase }
function mapListing(row: any): Listing { const image = row.listing_images?.find((item: any) => item.is_primary)?.image_url ?? row.listing_images?.[0]?.image_url ?? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85'; const summary = Array.isArray(row.listing_review_summary) ? row.listing_review_summary[0] : row.listing_review_summary; return { id: row.id, title: row.title, category: row.category, locality: row.locality ?? '', city: row.city ?? '', latitude: row.latitude === null || row.latitude === undefined ? null : Number(row.latitude), longitude: row.longitude === null || row.longitude === undefined ? null : Number(row.longitude), price: Number(row.monthly_rent ?? 0), foodCost: row.food_cost === null || row.food_cost === undefined ? null : Number(row.food_cost), electricityCost: row.electricity_cost === null || row.electricity_cost === undefined ? null : Number(row.electricity_cost), wifiCost: row.wifi_cost === null || row.wifi_cost === undefined ? null : Number(row.wifi_cost), laundryCost: row.laundry_cost === null || row.laundry_cost === undefined ? null : Number(row.laundry_cost), maintenanceCost: row.maintenance_cost === null || row.maintenance_cost === undefined ? null : Number(row.maintenance_cost), travelCost: row.travel_cost_estimate === null || row.travel_cost_estimate === undefined ? null : Number(row.travel_cost_estimate), securityDeposit: row.security_deposit === null || row.security_deposit === undefined ? null : Number(row.security_deposit), distance: row.distance_km === null || row.distance_km === undefined ? null : Number(row.distance_km), rating: summary?.average_rating === null || summary?.average_rating === undefined ? null : Number(summary.average_rating), lastVerifiedAt: row.last_verified_at ?? null, available: row.available_capacity ?? 0, total: row.total_capacity ?? 0, roomType: row.room_type ?? 'Not specified', genderPreference: row.gender_preference ?? 'Not provided', image, verified: row.verification_status === 'admin_verified', food: row.food_available, laundry: row.laundry_available, wifi: row.wifi_available } }

export async function fetchListings(filters: ListingFilters = {}) { const client = requireSupabase(); let query = client.from('listings').select('*, listing_images(image_url,is_primary), listing_review_summary(average_rating)').eq('status', 'approved').eq('is_active', true); if (filters.query) { const value = filters.query.replace(/[,()]/g, ' '); query = query.or(`title.ilike.%${value}%,locality.ilike.%${value}%,city.ilike.%${value}%,college_name.ilike.%${value}%,category.ilike.%${value}%`) } if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category); if (filters.collegeName) query = query.ilike('college_name', `%${filters.collegeName}%`); if (filters.maxRent !== undefined) query = query.lte('monthly_rent', filters.maxRent); if (filters.maxDistance !== undefined) query = query.lte('distance_km', filters.maxDistance); if (filters.roomType) query = query.eq('room_type', filters.roomType); if (filters.gender) query = query.eq('gender_preference', filters.gender); if (filters.food) query = query.eq('food_available', true); if (filters.laundry) query = query.eq('laundry_available', true); if (filters.wifi) query = query.eq('wifi_available', true); if (filters.minAvailable !== undefined) query = query.gte('available_capacity', filters.minAvailable); if (filters.recentlyVerified) query = query.gte('last_verified_at', new Date(Date.now() - 30 * 86400000).toISOString()); if (filters.sort === 'cost') query = query.order('monthly_rent', { ascending: true }); else if (filters.sort === 'distance') query = query.order('distance_km', { ascending: true, nullsFirst: false }); else if (filters.sort === 'updated') query = query.order('updated_at', { ascending: false }); const { data, error } = await query; if (error) throw error; let result = (data ?? []).map(mapListing); const maxTotal = filters.maxTotal; if (maxTotal !== undefined) result = result.filter((listing) => [listing.price, listing.foodCost, listing.electricityCost, listing.wifiCost, listing.laundryCost, listing.maintenanceCost, listing.travelCost].reduce((sum: number, value: number | null) => sum + (value ?? 0), 0) <= maxTotal); if (filters.sort === 'rating') result.sort((left, right) => (right.rating ?? -1) - (left.rating ?? -1)); return result }

export function validateNaturalSearchFilters(value: unknown): NaturalSearchFilters {
	if (!value || typeof value !== 'object') throw new Error('The search assistant returned an invalid filter set.')
	const input = value as Record<string, unknown>
	const result: NaturalSearchFilters = {}
	if (input.category !== undefined) { if (!['flat', 'hostel', 'pg', 'mess', 'laundry'].includes(String(input.category))) throw new Error('The search assistant returned an unsupported category.'); result.category = String(input.category) }
	if (input.college_name !== undefined) { if (typeof input.college_name !== 'string' || input.college_name.length > 120) throw new Error('The college name filter is invalid.'); result.collegeName = input.college_name }
	for (const [key, target] of [['max_total_monthly_cost', 'maxTotal'], ['max_distance_km', 'maxDistance']] as const) { if (input[key] !== undefined) { const number = Number(input[key]); if (!Number.isFinite(number) || number < 0 || number > 1000000) throw new Error('The search assistant returned an invalid numeric filter.'); result[target] = number } }
	if (input.gender_preference !== undefined) { if (typeof input.gender_preference !== 'string' || input.gender_preference.length > 60) throw new Error('The gender preference filter is invalid.'); result.gender = input.gender_preference }
	for (const key of ['food_available', 'laundry_available', 'wifi_available'] as const) if (input[key] !== undefined) { if (typeof input[key] !== 'boolean') throw new Error('The search assistant returned an invalid amenity filter.'); result[key === 'food_available' ? 'food' : key === 'laundry_available' ? 'laundry' : 'wifi'] = input[key] }
	return result
}
export async function parseNaturalSearch(prompt: string) { const client = requireSupabase(); if (!prompt.trim() || prompt.length > 500) throw new Error('Please enter a search under 500 characters.'); const { data, error } = await client.functions.invoke('parse-search', { body: { prompt } }); if (error) throw new Error('The search assistant is unavailable right now. Your normal filters still work.'); return validateNaturalSearchFilters(data?.filters) }
export async function getListing(id: string) { const client = requireSupabase(); const { data, error } = await client.from('listings').select('*, listing_images(image_url,is_primary), listing_review_summary(average_rating,approved_review_count)').eq('id', id).single(); if (error) throw error; return mapListing(data) }
export async function createListing(input: ListingInput, files: File[]) { const client = requireSupabase(); const { data: user } = await client.auth.getUser(); if (!user.user) throw new Error('Sign in as a provider first.'); if (!files.length) throw new Error('Add at least one photograph before submitting.'); const { data: listing, error } = await client.from('listings').insert({ ...input, owner_id: user.user.id, status: 'pending', verification_status: 'unverified' }).select().single(); if (error) throw error; await uploadListingImages(listing.id, files); return listing }
export async function updateListing(id: string, input: Partial<ListingInput>) { const client = requireSupabase(); const { data, error } = await client.from('listings').update(input).eq('id', id).select().single(); if (error) throw error; return data }
export async function deactivateListing(id: string) { const client = requireSupabase(); const { error } = await client.from('listings').update({ is_active: false }).eq('id', id); if (error) throw error }
export async function confirmVacancy(id: string, available: number) { const client = requireSupabase(); const { error } = await client.rpc('confirm_vacancy', { target_listing: id, new_capacity: available }); if (error) throw error }
export async function fetchProviderListings() { const client = requireSupabase(); const { data: user } = await client.auth.getUser(); if (!user.user) throw new Error('Sign in as a provider first.'); const { data, error } = await client.from('listings').select('*, listing_images(image_url,is_primary), listing_review_summary(average_rating)').eq('owner_id', user.user.id).order('updated_at', { ascending: false }); if (error) throw error; return (data ?? []).map(mapListing) }
export async function suspendListing(id: string) { const client = requireSupabase(); const { error } = await client.from('listings').update({ status: 'suspended' }).eq('id', id); if (error) throw error }
export async function uploadListingImages(listingId: string, files: File[]) { const client = requireSupabase(); const { data: user } = await client.auth.getUser(); if (!user.user) throw new Error('Sign in required.'); for (const file of files) { if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Images must be JPG, PNG, or WebP.'); if (file.size > 5 * 1024 * 1024) throw new Error('Each image must be 5 MB or smaller.'); const path = `${user.user.id}/${listingId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`; const { error: uploadError } = await client.storage.from('listing-images').upload(path, file, { upsert: false, contentType: file.type }); if (uploadError) throw uploadError; const { data: url } = client.storage.from('listing-images').getPublicUrl(path); const { error: rowError } = await client.from('listing_images').insert({ listing_id: listingId, image_url: url.publicUrl, storage_path: path }); if (rowError) throw rowError } }
export async function removeListingImage(imageId: string, path: string) { const client = requireSupabase(); const { error: storageError } = await client.storage.from('listing-images').remove([path]); if (storageError) throw storageError; const { error } = await client.from('listing_images').delete().eq('id', imageId); if (error) throw error }
export async function toggleSaved(listingId: string, saved: boolean): Promise<string[]> {
  let savedIds: string[] = []
  try {
    const raw = localStorage.getItem('campusnet_saved_listings') || '[]'
    savedIds = JSON.parse(raw)
  } catch {}

  if (saved) {
    savedIds = savedIds.filter(id => id !== listingId)
  } else {
    if (!savedIds.includes(listingId)) {
      savedIds.push(listingId)
    }
  }
  localStorage.setItem('campusnet_saved_listings', JSON.stringify(savedIds))
  window.dispatchEvent(new Event('campusnet_saved_change'))

  if (supabase) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        if (saved) {
          await supabase.from('saved_listings').delete().match({ student_id: user.user.id, listing_id: listingId })
        } else {
          await supabase.from('saved_listings').insert({ student_id: user.user.id, listing_id: listingId })
        }
      }
    } catch {}
  }
  return savedIds
}
export async function fetchSaved(): Promise<Listing[]> {
  if (supabase) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        const { data, error } = await supabase.from('saved_listings').select('listing_id, listings(*, listing_images(image_url,is_primary))').eq('student_id', user.user.id)
        if (!error && data && data.length > 0) {
          return data.map((row: any) => mapListing(row.listings))
        }
      }
    } catch {}
  }

  try {
    const raw = localStorage.getItem('campusnet_saved_listings') || '[]'
    const savedIds: string[] = JSON.parse(raw)
    return (puneListings as Listing[]).filter(item => savedIds.includes(item.id))
  } catch {
    return []
  }
}
export async function sendEnquiry(listingId: string, message: string, contactPreference: string) {
  const listing = (puneListings as Listing[]).find(l => l.id === listingId)
  const title = listing?.title || 'Listing ' + listingId
  const locality = listing?.locality || 'Pune'
  const city = listing?.city || 'Pune'

  try {
    const raw = localStorage.getItem('campusnet_enquiries') || '[]'
    const list = JSON.parse(raw)
    list.unshift({
      id: 'enq_' + Date.now(),
      listing_id: listingId,
      message,
      contactPreference,
      status: 'new',
      created_at: new Date().toISOString(),
      listings: { title, locality, city }
    })
    localStorage.setItem('campusnet_enquiries', JSON.stringify(list))
    window.dispatchEvent(new Event('campusnet_enquiry_change'))
  } catch {}

  if (supabase) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        await supabase.from('enquiries').insert({ listing_id: listingId, student_id: user.user.id, message, contact_preference: contactPreference })
      }
    } catch {}
  }
}
export async function submitReview(listingId: string, rating: number, comment: string) {
  const listing = (puneListings as Listing[]).find(l => l.id === listingId)
  try {
    const raw = localStorage.getItem('campusnet_reviews') || '[]'
    const list = JSON.parse(raw)
    list.unshift({
      id: 'rev_' + Date.now(),
      listing_id: listingId,
      listing_title: listing?.title || 'Listing ' + listingId,
      rating,
      comment,
      created_at: new Date().toISOString()
    })
    localStorage.setItem('campusnet_reviews', JSON.stringify(list))
    window.dispatchEvent(new Event('campusnet_review_change'))
  } catch {}

  if (supabase) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        await supabase.from('reviews').insert({ listing_id: listingId, student_id: user.user.id, rating, comment })
      }
    } catch {}
  }
}
export async function reportListing(listingId: string, reason: string, description: string) { const client = requireSupabase(); const { data: user } = await client.auth.getUser(); if (!user.user) throw new Error('Sign in to report a listing.'); const { error } = await client.from('reports').insert({ listing_id: listingId, reporter_id: user.user.id, reason, description }); if (error) throw error }
export async function fetchMyEnquiries() {
  if (supabase) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user?.user) {
        const { data, error } = await supabase.from('enquiries').select('id,message,status,created_at,listing_id,listings(title,locality,city)').eq('student_id', user.user.id).order('created_at', { ascending: false })
        if (!error && data && data.length > 0) return data
      }
    } catch {}
  }
  try {
    const raw = localStorage.getItem('campusnet_enquiries') || '[]'
    return JSON.parse(raw)
  } catch {
    return []
  }
}
export async function fetchProviderEnquiries() { const client = requireSupabase(); const { data: user } = await client.auth.getUser(); if (!user.user) return []; const { data, error } = await client.from('enquiries').select('id,message,status,created_at,listing_id,student_id,listings!inner(title)').eq('listings.owner_id', user.user.id).order('created_at', { ascending: false }); if (error) throw error; return data ?? [] }
export async function updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') { const client = requireSupabase(); const { error } = await client.from('enquiries').update({ status }).eq('id', id); if (error) throw error }
