import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/donations/[id] - Get single donation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = params

    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        projects (
          id,
          title
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

// PUT /api/admin/donations/[id] - Update donation
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

    // Get existing donation for audit log
    const { data: existingDonation } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('donations')
      .update(body)
      .eq('id', id)
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

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'update',
      table_name: 'donations',
      record_id: id,
      old_data: existingDonation,
      new_data: data,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/donations/[id] - Delete donation
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

    // Get existing donation for audit log
    const { data: existingDonation } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
    }

    // Update project raised amount if project_id exists
    if (existingDonation.project_id && existingDonation.status === 'completed') {
      const { data: project } = await supabase
        .from('projects')
        .select('raised_amount')
        .eq('id', existingDonation.project_id)
        .single()

      if (project) {
        await supabase
          .from('projects')
          .update({ 
            raised_amount: Math.max(0, (project.raised_amount || 0) - existingDonation.amount) 
          })
          .eq('id', existingDonation.project_id)
      }
    }

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log audit action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'delete',
      table_name: 'donations',
      record_id: id,
      old_data: existingDonation,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
