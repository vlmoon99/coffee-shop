-- Rollback First
DELETE FROM public.products WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006'
);

-- Insert Seed Products
INSERT INTO public.products (id, name, category, description, price, stock_count, image_url, specs)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001',
        'Ethiopia Yirgacheffe',
        'coffee',
        'Bright and floral with notes of jasmine, bergamot, and blueberry.',
        19.99,
        50,
        'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600',
        '{"roast": "Light", "grind": "Whole Bean", "region": "Yirgacheffe", "process": "Washed"}'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Colombia Supremo',
        'coffee',
        'Smooth and balanced with caramel sweetness and a hint of apple.',
        18.50,
        20,
        'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=600',
        '{"roast": "Medium", "grind": "Whole Bean", "region": "Huila", "process": "Natural"}'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Chemex Glass Coffeemaker',
        'equipment',
        'Classic glass coffeemaker for an elegant pour-over experience.',
        45.00,
        10,
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
        '{"material": "Boro Glass", "capacity": "6 Cups", "origin": "USA"}'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Hario V60 Filters',
        'equipment',
        'Paper filters for Hario V60 dripper, size 02.',
        8.50,
        100,
        'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=600',
        '{"quantity": "100 Sheets", "size": "02", "color": "White"}'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Artisan Chocolate Truffles',
        'sweets',
        'A box of handcrafted dark chocolate truffles.',
        12.00,
        15,
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
        '{"cocoa": "70%", "weight": "200g", "allergens": "Dairy, Nuts"}'
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        'Brazil Cerrado',
        'coffee',
        'Nutty and sweet with low acidity and a heavy, creamy body.',
        16.50,
        5,
        'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=600',
        '{"roast": "Medium-Dark", "grind": "Whole Bean", "region": "Cerrado Mineiro", "process": "Pulped Natural"}'
    );
