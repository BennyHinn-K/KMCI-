import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/donations - Get all donations
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const paymentMethod = searchParams.get('payment_method') || ''
    const projectId = searchParams.get('project_id') || ''

    let query = supabase
      .from('donations')
      .select(`
        *,
        projects (
          id,
          title
        )
      `)

    // Apply filters
    if (search) {
      query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%,payment_reference.ilike.%${search}%`)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (paymentMethod) {
      query = query.eq('payment_method', paymentMethod)
    }
    if (projectId) {
      query = query.eq('project_id', projectId)
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

// POST /api/admin/donations - Create new donation (manual entry)
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
    const { donor_name, donor_email, amount, payment_method, project_id } = body
    if (!donor_name || !donor_email || !amount || !payment_method) {
      return NextResponse.json({ error: 'Donor name, email, amount, and payment method are required' }, { status: 400 })
    }

    const donation = {
      donor_name,
      donor_email,
      donor_phone: body.donor_phone || null,
      amount: parseFloat(amount),
      currency: body.currency || 'KES',
      payment_method,
      payment_reference: body.payment_reference || null,
      project_id: project_id || null,
      is_anonymous: body.is_anonymous || false,
      is_recurring: body.is_recurring || false,
      frequency: body.frequency || 'one_time',
      status: 'completed', // Manual entries are marked as completed
      notes: body.notes || null
    }

    const { data, error } = await supabase
      .from('donations')
      .insert(donation)
      .select(`
        *,
        projects (
          id,
          title
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update project raised amount if project_id is provided
    if (project_id) {
      const { data: project } = await supabase
        .from('projects')
        .select('raised_amount')
        .eq('id', project_id)
        .single()

      if (project) {
        await supabase
          .from('projects')
          .update({ 
            raised_amount: (project.raised_amount || 0) + parseFloat(amount) 
          })
          .eq('id', project_id)
      }
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'create',
      table_name: 'donations',
      record_id: data.id,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
