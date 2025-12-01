-- Insert a visible active product for live verification
insert into products
  (title, slug, description, full_content, price, currency, category, status, stock, is_featured, image_url, created_by)
values
  (
    'Live Test Product',
    'live-test-product-' || extract(epoch from now())::bigint,
    'A live test product to verify production visibility.',
    'This product was created automatically to verify end-to-end functionality in production.',
    1999.00,
    'KES',
    'testing',
    'active',
    10,
    true,
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&q=80&auto=format&fit=crop',
    null
  );



