-- Initial data for the jewelry store

-- Insert initial categories
insert into public.categories (name, description) values
  ('Rings', 'Beautiful rings for every occasion'),
  ('Necklaces', 'Elegant necklaces and pendants'),
  ('Earrings', 'Stunning earrings for any style'),
  ('Bracelets', 'Fashionable bracelets and bangles'),
  ('Sets', 'Matching jewelry sets');

-- Insert default settings
insert into public.settings (
  business_phone,
  business_name,
  message_template,
  items_per_page,
  featured_categories
) values (
  '+1234567890',
  'Donna''s Jewelry & Accessories',
  'Hi! I''m interested in {title} ({price}). Could you tell me more about availability?',
  12,
  array['rings', 'necklaces', 'earrings']
);

-- Insert sample products
insert into public.products (
  title,
  description,
  price,
  category,
  tags,
  in_stock,
  featured
) values 
(
  'Gold Plated Necklace',
  'Elegant gold plated necklace with Ghanaian beads.',
  '$49',
  'necklaces',
  array['gold', 'necklace', 'ghana'],
  true,
  true
),
(
  'Classic Hoop Earrings',
  'Timeless hoop earrings for every occasion.',
  '$29',
  'earrings',
  array['earrings', 'classic'],
  true,
  false
),
(
  'Beaded Bracelet',
  'Handcrafted bracelet with colorful beads.',
  '$19',
  'bracelets',
  array['bracelet', 'beads'],
  true,
  false
);
