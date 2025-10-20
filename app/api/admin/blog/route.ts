import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const published = searchParams.get('published')

    let query = supabase
      .from('blog_posts')
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
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (published !== null) {
      query = query.eq('is_published', published === 'true')
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

// POST /api/admin/blog - Create new blog post
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
    const { title, content, excerpt, category, featured_image_url, tags } = body
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const blogPost = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      category: category || 'news',
      featured_image_url,
      tags: tags || [],
      author_id: user.id,
      is_published: false,
      published_at: null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blogPost)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      table_name: 'blog_posts',
      record_id: data.id,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
