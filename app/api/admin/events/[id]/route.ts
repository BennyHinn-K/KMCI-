import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params
    const body = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get existing event for audit log
    const { data: existingEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Update slug if title changed
    let updateData = { ...body }
    if (body.title && body.title !== existingEvent.title) {
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      table_name: 'events',
      record_id: id,
      old_data: existingEvent,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get existing event for audit log
    const { data: existingEvent } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      table_name: 'events',
      record_id: id,
      old_data: existingEvent,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
