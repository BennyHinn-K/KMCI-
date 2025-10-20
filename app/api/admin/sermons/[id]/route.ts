import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/sermons/[id] - Get single sermon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params

    const { data, error } = await supabase
      .from('sermons')
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

// PUT /api/admin/sermons/[id] - Update sermon
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

    // Get existing sermon for audit log
    const { data: existingSermon } = await supabase
      .from('sermons')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingSermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 })
    }

    // Update slug if title changed
    let updateData = { ...body }
    if (body.title && body.title !== existingSermon.title) {
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const { data, error } = await supabase
      .from('sermons')
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
      table_name: 'sermons',
      record_id: id,
      old_data: existingSermon,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/sermons/[id] - Delete sermon
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

    // Get existing sermon for audit log
    const { data: existingSermon } = await supabase
      .from('sermons')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingSermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      table_name: 'sermons',
      record_id: id,
      old_data: existingSermon,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ message: 'Sermon deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
