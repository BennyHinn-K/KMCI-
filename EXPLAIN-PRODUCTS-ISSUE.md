# 🔍 Why Products Are Not Being Saved - Root Cause Analysis

## The Problem

Products are **not being saved** to the database due to **Row Level Security (RLS) policy issues**. Here's exactly what's happening:

## Root Cause #1: Missing `WITH CHECK` Clause

The main issue is in the RLS policy for products. Looking at `scripts/02-create-policies.sql` line 76-80:

```sql
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('super_admin', 'editor')
  ));
```

**Problem**: This policy only has a `USING` clause. For **INSERT** operations in PostgreSQL RLS, you need a **`WITH CHECK`** clause. Without it, INSERT operations are blocked even if the `USING` clause would allow it.

- `USING` clause: Evaluates for SELECT, UPDATE, DELETE
- `WITH CHECK` clause: Required for INSERT operations

## Root Cause #2: Conflicting Policies

There may be multiple policies created from different setup scripts:
1. `scripts/00-complete-setup.sql` - Creates policy: "Authenticated users can manage products"
2. `scripts/02-create-policies.sql` - Creates policy: "Admins can manage products"

These conflicting policies can cause unexpected behavior.

## Root Cause #3: User Profile/Role Issue

Even with correct policies, if your user:
- Doesn't exist in the `profiles` table, OR
- Doesn't have `super_admin` or `editor` role

Then the INSERT will be blocked.

## The Exact Error Flow

When you try to save a product:

1. ✅ User is authenticated (passes `auth.getUser()`)
2. ✅ Form data is valid
3. ✅ Code reaches `supabase.from("products").insert(payload)`
4. ❌ **RLS Policy blocks the INSERT** because:
   - Policy has no `WITH CHECK` clause for INSERT, OR
   - User's role is not `super_admin` or `editor` in profiles table

## Solution

Run the `FIX-PRODUCTS-DATABASE.sql` script which:

1. ✅ Drops all conflicting policies
2. ✅ Creates separate policies for SELECT, INSERT, UPDATE, DELETE
3. ✅ Adds proper `WITH CHECK` clause for INSERT
4. ✅ Ensures admins/editors can manage products

## How to Verify the Issue

Run `DIAGNOSE-PRODUCTS-ISSUE.sql` to check:
- If policies exist and are correct
- If your user has the right role
- If the INSERT policy has `WITH CHECK`

## Quick Fix Location

The fix is in: **`FIX-PRODUCTS-DATABASE.sql`**

Run this in Supabase SQL Editor to resolve the issue immediately.


