import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured')

    let query = supabase
      .from('events')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email
        )
      `)

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (featured !== null) {
      query = query.eq('is_featured', featured === 'true')
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .order('event_date', { ascending: true })
      .range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    const { title, description, event_date, end_date, location, max_attendees } = body
    if (!title || !event_date) {
      return NextResponse.json({ error: 'Title and event date are required' }, { status: 400 })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const event = {
      title,
      slug,
      description,
      event_date,
      end_date: end_date || event_date,
      location,
      max_attendees: max_attendees || null,
      current_attendees: 0,
      is_featured: false,
      status: 'upcoming',
      created_by: user.id
    }

    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      table_name: 'events',
      record_id: data.id,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
