import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/sermons - Get all sermons
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const speaker = searchParams.get('speaker') || ''
    const featured = searchParams.get('featured')

    let query = supabase
      .from('sermons')
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
    if (speaker) {
      query = query.ilike('speaker', `%${speaker}%`)
    }
    if (featured !== null) {
      query = query.eq('is_featured', featured === 'true')
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .order('sermon_date', { ascending: false })
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

// POST /api/admin/sermons - Create new sermon
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
    const { title, speaker, sermon_date, description } = body
    if (!title || !speaker || !sermon_date) {
      return NextResponse.json({ error: 'Title, speaker, and sermon date are required' }, { status: 400 })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const sermon = {
      title,
      slug,
      speaker,
      description,
      sermon_date,
      video_url: body.video_url || null,
      audio_url: body.audio_url || null,
      thumbnail_url: body.thumbnail_url || null,
      study_guide_url: body.study_guide_url || null,
      scripture_reference: body.scripture_reference || null,
      tags: body.tags || [],
      duration: body.duration || null,
      views: 0,
      is_featured: false,
      created_by: user.id
    }

    const { data, error } = await supabase
      .from('sermons')
      .insert(sermon)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      table_name: 'sermons',
      record_id: data.id,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
