import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured')

    let query = supabase
      .from('projects')
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
    if (category) {
      query = query.eq('category', category)
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
      .order('created_at', { ascending: false })
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

// POST /api/admin/projects - Create new project
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
    const { title, description, category, goal_amount } = body
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const project = {
      title,
      slug,
      description,
      full_content: body.full_content || description,
      category,
      goal_amount: goal_amount || 0,
      raised_amount: 0,
      currency: 'KES',
      image_url: body.image_url || null,
      gallery_urls: body.gallery_urls || [],
      families_reached: 0,
      communities_served: 0,
      start_date: body.start_date || null,
      target_completion_date: body.target_completion_date || null,
      status: 'planning',
      is_featured: false,
      created_by: user.id
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      table_name: 'projects',
      record_id: data.id,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
