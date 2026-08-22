// ========== 10 Kerala Village Camps ==========
export const seedCamps = [
  { id: 'camp-1', name: 'Aluva Relief Camp', village: 'Aluva', latitude: 10.1077, longitude: 76.3516, total_capacity: 600, current_population: 450, children_count: 70, elderly_count: 55, pregnant_count: 6, injured_count: 12, road_accessibility: 8, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-2', name: 'Chalakudy Relief Camp', village: 'Chalakudy', latitude: 10.3105, longitude: 76.3311, total_capacity: 1000, current_population: 800, children_count: 150, elderly_count: 100, pregnant_count: 12, injured_count: 45, road_accessibility: 3, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-3', name: 'Perumbavoor Relief Camp', village: 'Perumbavoor', latitude: 10.1074, longitude: 76.4737, total_capacity: 500, current_population: 320, children_count: 50, elderly_count: 40, pregnant_count: 4, injured_count: 8, road_accessibility: 7, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-4', name: 'Muvattupuzha Relief Camp', village: 'Muvattupuzha', latitude: 9.9894, longitude: 76.5790, total_capacity: 700, current_population: 560, children_count: 90, elderly_count: 70, pregnant_count: 8, injured_count: 25, road_accessibility: 5, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-5', name: 'Kothamangalam Relief Camp', village: 'Kothamangalam', latitude: 10.0602, longitude: 76.6270, total_capacity: 400, current_population: 280, children_count: 45, elderly_count: 35, pregnant_count: 3, injured_count: 10, road_accessibility: 6, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-6', name: 'Piravom Relief Camp', village: 'Piravom', latitude: 9.8726, longitude: 76.4924, total_capacity: 800, current_population: 650, children_count: 120, elderly_count: 85, pregnant_count: 10, injured_count: 40, road_accessibility: 2, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-7', name: 'Angamaly Relief Camp', village: 'Angamaly', latitude: 10.1960, longitude: 76.3860, total_capacity: 300, current_population: 180, children_count: 30, elderly_count: 25, pregnant_count: 2, injured_count: 5, road_accessibility: 9, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-8', name: 'Kalady Relief Camp', village: 'Kalady', latitude: 10.1680, longitude: 76.4410, total_capacity: 550, current_population: 420, children_count: 65, elderly_count: 50, pregnant_count: 5, injured_count: 18, road_accessibility: 5, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-9', name: 'Paravur Relief Camp', village: 'Paravur', latitude: 10.1451, longitude: 76.2270, total_capacity: 900, current_population: 750, children_count: 130, elderly_count: 90, pregnant_count: 11, injured_count: 35, road_accessibility: 3, status: 'active', last_report_at: new Date().toISOString() },
  { id: 'camp-10', name: 'Thrippunithura Relief Camp', village: 'Thrippunithura', latitude: 9.9506, longitude: 76.3486, total_capacity: 450, current_population: 350, children_count: 55, elderly_count: 45, pregnant_count: 4, injured_count: 10, road_accessibility: 7, status: 'active', last_report_at: new Date().toISOString() },
];

// Resources: food(kits), water(liters), medicine(packs), shelter(beds)
// Surplus camps: Aluva, Perumbavoor, Angamaly, Thrippunithura
// Critical camps: Chalakudy, Piravom, Paravur
function r(campId, type, qty, unit, dailyConsumption) {
  return { id: `res-${campId}-${type}`, camp_id: campId, resource_type: type, quantity: qty, unit, daily_consumption: dailyConsumption, last_updated: new Date().toISOString() };
}

export const seedResources = [
  // Aluva — SURPLUS
  r('camp-1', 'food', 4680, 'kits', 900), r('camp-1', 'water', 4185, 'liters', 1350), r('camp-1', 'medicine', 675, 'packs', 225), r('camp-1', 'shelter', 468, 'beds', 450),
  // Chalakudy — CRITICAL
  r('camp-2', 'food', 480, 'kits', 1600), r('camp-2', 'water', 800, 'liters', 2400), r('camp-2', 'medicine', 40, 'packs', 400), r('camp-2', 'shelter', 760, 'beds', 800),
  // Perumbavoor — SURPLUS
  r('camp-3', 'food', 3072, 'kits', 640), r('camp-3', 'water', 4032, 'liters', 960), r('camp-3', 'medicine', 480, 'packs', 160), r('camp-3', 'shelter', 288, 'beds', 320),
  // Muvattupuzha — WARNING
  r('camp-4', 'food', 1232, 'kits', 1120), r('camp-4', 'water', 3024, 'liters', 1680), r('camp-4', 'medicine', 168, 'packs', 280), r('camp-4', 'shelter', 493, 'beds', 560),
  // Kothamangalam — WATCH
  r('camp-5', 'food', 1960, 'kits', 560), r('camp-5', 'water', 2520, 'liters', 840), r('camp-5', 'medicine', 280, 'packs', 140), r('camp-5', 'shelter', 174, 'beds', 280),
  // Piravom — CRITICAL
  r('camp-6', 'food', 130, 'kits', 1300), r('camp-6', 'water', 195, 'liters', 1950), r('camp-6', 'medicine', 0, 'packs', 325), r('camp-6', 'shelter', 650, 'beds', 650),
  // Angamaly — SURPLUS
  r('camp-7', 'food', 2160, 'kits', 360), r('camp-7', 'water', 2970, 'liters', 540), r('camp-7', 'medicine', 360, 'packs', 90), r('camp-7', 'shelter', 108, 'beds', 180),
  // Kalady — WATCH
  r('camp-8', 'food', 1680, 'kits', 840), r('camp-8', 'water', 1890, 'liters', 1260), r('camp-8', 'medicine', 210, 'packs', 210), r('camp-8', 'shelter', 302, 'beds', 420),
  // Paravur — CRITICAL
  r('camp-9', 'food', 600, 'kits', 1500), r('camp-9', 'water', 675, 'liters', 2250), r('camp-9', 'medicine', 75, 'packs', 375), r('camp-9', 'shelter', 690, 'beds', 750),
  // Thrippunithura — STABLE
  r('camp-10', 'food', 2800, 'kits', 700), r('camp-10', 'water', 3780, 'liters', 1050), r('camp-10', 'medicine', 350, 'packs', 175), r('camp-10', 'shelter', 192, 'beds', 350),
];

export const seedVehicles = [
  { id: 'v-1', driver_name: 'Suresh Kumar', driver_phone: '+91 94460 12345', vehicle_type: 'Truck', vehicle_number: 'KL-07-AB-1234', carrying_capacity: 500, can_access_flooded: false, current_latitude: 10.12, current_longitude: 76.36, availability: 'available' },
  { id: 'v-2', driver_name: 'Rajan Pillai', driver_phone: '+91 94460 23456', vehicle_type: 'Boat', vehicle_number: 'KL-BOAT-002', carrying_capacity: 200, can_access_flooded: true, current_latitude: 10.15, current_longitude: 76.28, availability: 'available' },
  { id: 'v-3', driver_name: 'Manoj Thomas', driver_phone: '+91 94460 34567', vehicle_type: 'Auto', vehicle_number: 'KL-39-C-5678', carrying_capacity: 100, can_access_flooded: false, current_latitude: 10.05, current_longitude: 76.45, availability: 'on_delivery' },
  { id: 'v-4', driver_name: 'Anil Nair', driver_phone: '+91 94460 45678', vehicle_type: 'Truck', vehicle_number: 'KL-07-CD-9012', carrying_capacity: 800, can_access_flooded: true, current_latitude: 10.20, current_longitude: 76.39, availability: 'available' },
  { id: 'v-5', driver_name: 'Priya Menon', driver_phone: '+91 94460 56789', vehicle_type: 'Car', vehicle_number: 'KL-01-EF-3456', carrying_capacity: 50, can_access_flooded: false, current_latitude: 9.97, current_longitude: 76.35, availability: 'available' },
];

export const seedCollectionCenters = [
  { id: 'cc-1', name: 'Kochi Central Hub', address: 'MG Road, Ernakulam, Kochi', latitude: 9.9816, longitude: 76.2999, operating_hours: '8 AM - 8 PM', status: 'active' },
  { id: 'cc-2', name: 'Thrissur Collection Center', address: 'Round South, Thrissur', latitude: 10.5276, longitude: 76.2144, operating_hours: '9 AM - 6 PM', status: 'active' },
  { id: 'cc-3', name: 'Aluva Town Hall Point', address: 'Aluva Town Hall, Aluva', latitude: 10.1077, longitude: 76.3516, operating_hours: '24/7', status: 'active' },
];

export const seedDonations = [
  { id: 'd-1', donor_name: 'Rahul Sharma', amount: 2000, preferred_resource: 'food', allocated_camp_id: 'camp-2', allocated_camp: 'Chalakudy', resource_type: 'food', resource_quantity: 100, status: 'delivered', donated_at: '2026-08-20T10:30:00Z' },
  { id: 'd-2', donor_name: 'Sneha Iyer', amount: 5000, preferred_resource: 'medicine', allocated_camp_id: 'camp-6', allocated_camp: 'Piravom', resource_type: 'medicine', resource_quantity: 50, status: 'dispatched', donated_at: '2026-08-21T14:00:00Z' },
  { id: 'd-3', donor_name: 'Amit Patel', amount: 1000, preferred_resource: 'any', allocated_camp_id: 'camp-9', allocated_camp: 'Paravur', resource_type: 'water', resource_quantity: 200, status: 'allocated', donated_at: '2026-08-22T08:00:00Z' },
  { id: 'd-4', donor_name: 'Meera Krishnan', amount: 3000, preferred_resource: 'food', allocated_camp_id: 'camp-2', allocated_camp: 'Chalakudy', resource_type: 'food', resource_quantity: 150, status: 'delivered', donated_at: '2026-08-19T16:00:00Z' },
  { id: 'd-5', donor_name: 'Vijay Menon', amount: 10000, preferred_resource: 'shelter', allocated_camp_id: 'camp-6', allocated_camp: 'Piravom', resource_type: 'shelter', resource_quantity: 20, status: 'donated', donated_at: '2026-08-22T12:00:00Z' },
];

export const seedItemDonations = [
  { id: 'id-1', donor_name: 'Priya Nair', item_category: 'Clothes', item_subcategory: "Children's Clothes", quantity: 50, condition: 'new', description: 'Winter jackets for kids', handover_method: 'drop_off', collection_center: 'Kochi Central Hub', allocated_camp: 'Chalakudy', status: 'delivered', registered_at: '2026-08-20T09:00:00Z' },
  { id: 'id-2', donor_name: 'Ramesh Babu', item_category: 'Blankets', item_subcategory: 'Woolen Blankets', quantity: 30, condition: 'gently_used', description: 'Clean woolen blankets', handover_method: 'pickup', pickup_address: '15 Church Rd, Kochi', allocated_camp: 'Piravom', status: 'dispatched', registered_at: '2026-08-21T11:00:00Z' },
  { id: 'id-3', donor_name: 'Lakshmi Devi', item_category: 'Food Packets', item_subcategory: 'Rice & Provisions', quantity: 100, condition: 'new', description: '5kg rice packets', handover_method: 'drop_off', collection_center: 'Aluva Town Hall Point', allocated_camp: 'Paravur', status: 'sorted', registered_at: '2026-08-22T07:00:00Z' },
  { id: 'id-4', donor_name: 'Thomas Mathew', item_category: 'Medicine', item_subcategory: 'First Aid Kits', quantity: 20, condition: 'new', description: 'Complete first aid kits', handover_method: 'drop_off', collection_center: 'Kochi Central Hub', allocated_camp: 'Chalakudy', status: 'collected', registered_at: '2026-08-22T10:00:00Z' },
  { id: 'id-5', donor_name: 'Fatima Begum', item_category: 'Utensils', item_subcategory: 'Cooking Utensils', quantity: 15, condition: 'new', description: 'Steel cooking pots and plates', handover_method: 'pickup', pickup_address: '42 MG Road, Thrissur', allocated_camp: 'Muvattupuzha', status: 'registered', registered_at: '2026-08-22T13:00:00Z' },
];

export const seedRecommendations = [
  { id: 'rec-1', source_camp_id: 'camp-1', source_camp: 'Aluva', target_camp_id: 'camp-2', target_camp: 'Chalakudy', resource_type: 'food', quantity: 1200, priority_score: 24, status: 'pending', reason: 'Chalakudy has 7.2h of food remaining. Aluva has 5.2 days surplus.', estimated_delivery_hours: 3.5, is_duplication_redirect: false },
  { id: 'rec-2', source_camp_id: 'camp-3', source_camp: 'Perumbavoor', target_camp_id: 'camp-6', target_camp: 'Piravom', resource_type: 'medicine', quantity: 300, priority_score: 27, status: 'pending', reason: 'Piravom medicine EXHAUSTED. 650 people including 40 injured with zero medicine.', estimated_delivery_hours: 2.1, is_duplication_redirect: false },
  { id: 'rec-3', source_camp_id: 'camp-7', source_camp: 'Angamaly', target_camp_id: 'camp-9', target_camp: 'Paravur', resource_type: 'food', quantity: 800, priority_score: 22, status: 'pending', reason: 'Paravur has 9.6h of food for 750 people. Angamaly has 6 days surplus.', estimated_delivery_hours: 4.2, is_duplication_redirect: false },
];

// Helper to get resources for a specific camp
export function getCampResources(campId) {
  return seedResources.filter((r) => r.camp_id === campId);
}

// Helper to calculate days remaining for a resource
export function getDaysRemaining(resource) {
  if (resource.daily_consumption <= 0) return 999;
  return +(resource.quantity / resource.daily_consumption).toFixed(1);
}
