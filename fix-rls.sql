-- Habilitar RLS em todas as tabelas (mantém proteção)
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paystubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrols ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE correspondencias ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES: Anon (pré-login) pode ler staff e clients
-- Polices: Authenticated pode ler/escrever tudo
-- ============================================================

-- STAFF
DROP POLICY IF EXISTS "anon_select_staff" ON staff;
DROP POLICY IF EXISTS "auth_all_staff" ON staff;
CREATE POLICY "anon_select_staff" ON staff FOR SELECT USING (true);
CREATE POLICY "auth_all_staff" ON staff FOR ALL USING (auth.role() = 'authenticated');

-- CLIENTS
DROP POLICY IF EXISTS "anon_select_clients" ON clients;
DROP POLICY IF EXISTS "auth_all_clients" ON clients;
CREATE POLICY "anon_select_clients" ON clients FOR SELECT USING (true);
CREATE POLICY "auth_all_clients" ON clients FOR ALL USING (auth.role() = 'authenticated');

-- SHIFTS
DROP POLICY IF EXISTS "anon_select_shifts" ON shifts;
DROP POLICY IF EXISTS "auth_all_shifts" ON shifts;
CREATE POLICY "anon_select_shifts" ON shifts FOR SELECT USING (true);
CREATE POLICY "auth_all_shifts" ON shifts FOR ALL USING (auth.role() = 'authenticated');

-- TRANSACTIONS
DROP POLICY IF EXISTS "anon_select_transactions" ON transactions;
DROP POLICY IF EXISTS "auth_all_transactions" ON transactions;
CREATE POLICY "anon_select_transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "auth_all_transactions" ON transactions FOR ALL USING (auth.role() = 'authenticated');

-- PAYSTUBS
DROP POLICY IF EXISTS "anon_select_paystubs" ON paystubs;
DROP POLICY IF EXISTS "auth_all_paystubs" ON paystubs;
CREATE POLICY "anon_select_paystubs" ON paystubs FOR SELECT USING (true);
CREATE POLICY "auth_all_paystubs" ON paystubs FOR ALL USING (auth.role() = 'authenticated');

-- ANNOUNCEMENTS
DROP POLICY IF EXISTS "anon_select_announcements" ON announcements;
DROP POLICY IF EXISTS "auth_all_announcements" ON announcements;
CREATE POLICY "anon_select_announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "auth_all_announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');

-- CHANGE_REQUESTS
DROP POLICY IF EXISTS "anon_select_change_requests" ON change_requests;
DROP POLICY IF EXISTS "auth_all_change_requests" ON change_requests;
CREATE POLICY "anon_select_change_requests" ON change_requests FOR SELECT USING (true);
CREATE POLICY "auth_all_change_requests" ON change_requests FOR ALL USING (auth.role() = 'authenticated');

-- VEHICLE_CHECKLISTS
DROP POLICY IF EXISTS "anon_select_vehicle_checklists" ON vehicle_checklists;
DROP POLICY IF EXISTS "auth_all_vehicle_checklists" ON vehicle_checklists;
CREATE POLICY "anon_select_vehicle_checklists" ON vehicle_checklists FOR SELECT USING (true);
CREATE POLICY "auth_all_vehicle_checklists" ON vehicle_checklists FOR ALL USING (auth.role() = 'authenticated');

-- PATROLS
DROP POLICY IF EXISTS "anon_select_patrols" ON patrols;
DROP POLICY IF EXISTS "auth_all_patrols" ON patrols;
CREATE POLICY "anon_select_patrols" ON patrols FOR SELECT USING (true);
CREATE POLICY "auth_all_patrols" ON patrols FOR ALL USING (auth.role() = 'authenticated');

-- POSTS
DROP POLICY IF EXISTS "anon_select_posts" ON posts;
DROP POLICY IF EXISTS "auth_all_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "auth_all_posts" ON posts FOR ALL USING (auth.role() = 'authenticated');

-- ENTRY_LOGS
DROP POLICY IF EXISTS "anon_select_entry_logs" ON entry_logs;
DROP POLICY IF EXISTS "auth_all_entry_logs" ON entry_logs;
CREATE POLICY "anon_select_entry_logs" ON entry_logs FOR SELECT USING (true);
CREATE POLICY "auth_all_entry_logs" ON entry_logs FOR ALL USING (auth.role() = 'authenticated');

-- GUEST_LISTS
DROP POLICY IF EXISTS "anon_select_guest_lists" ON guest_lists;
DROP POLICY IF EXISTS "auth_all_guest_lists" ON guest_lists;
CREATE POLICY "anon_select_guest_lists" ON guest_lists FOR SELECT USING (true);
CREATE POLICY "auth_all_guest_lists" ON guest_lists FOR ALL USING (auth.role() = 'authenticated');

-- RESERVATIONS
DROP POLICY IF EXISTS "anon_select_reservations" ON reservations;
DROP POLICY IF EXISTS "auth_all_reservations" ON reservations;
CREATE POLICY "anon_select_reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "auth_all_reservations" ON reservations FOR ALL USING (auth.role() = 'authenticated');

-- MATERIAL_REQUESTS
DROP POLICY IF EXISTS "anon_select_material_requests" ON material_requests;
DROP POLICY IF EXISTS "auth_all_material_requests" ON material_requests;
CREATE POLICY "anon_select_material_requests" ON material_requests FOR SELECT USING (true);
CREATE POLICY "auth_all_material_requests" ON material_requests FOR ALL USING (auth.role() = 'authenticated');

-- SUPPLIERS
DROP POLICY IF EXISTS "anon_select_suppliers" ON suppliers;
DROP POLICY IF EXISTS "auth_all_suppliers" ON suppliers;
CREATE POLICY "anon_select_suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "auth_all_suppliers" ON suppliers FOR ALL USING (auth.role() = 'authenticated');

-- PACKAGES
DROP POLICY IF EXISTS "anon_select_packages" ON packages;
DROP POLICY IF EXISTS "auth_all_packages" ON packages;
CREATE POLICY "anon_select_packages" ON packages FOR SELECT USING (true);
CREATE POLICY "auth_all_packages" ON packages FOR ALL USING (auth.role() = 'authenticated');

-- INVENTORY_ITEMS
DROP POLICY IF EXISTS "anon_select_inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "auth_all_inventory_items" ON inventory_items;
CREATE POLICY "anon_select_inventory_items" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "auth_all_inventory_items" ON inventory_items FOR ALL USING (auth.role() = 'authenticated');

-- INVENTORY_MOVEMENTS
DROP POLICY IF EXISTS "anon_select_inventory_movements" ON inventory_movements;
DROP POLICY IF EXISTS "auth_all_inventory_movements" ON inventory_movements;
CREATE POLICY "anon_select_inventory_movements" ON inventory_movements FOR SELECT USING (true);
CREATE POLICY "auth_all_inventory_movements" ON inventory_movements FOR ALL USING (auth.role() = 'authenticated');

-- SHIFT_CHECKINS
DROP POLICY IF EXISTS "anon_select_shift_checkins" ON shift_checkins;
DROP POLICY IF EXISTS "auth_all_shift_checkins" ON shift_checkins;
CREATE POLICY "anon_select_shift_checkins" ON shift_checkins FOR SELECT USING (true);
CREATE POLICY "auth_all_shift_checkins" ON shift_checkins FOR ALL USING (auth.role() = 'authenticated');

-- AUDIT_LOGS
DROP POLICY IF EXISTS "anon_select_audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "auth_all_audit_logs" ON audit_logs;
CREATE POLICY "anon_select_audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "auth_all_audit_logs" ON audit_logs FOR ALL USING (auth.role() = 'authenticated');

-- CORRESPONDENCIAS (se existir)
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'correspondencias') THEN
    DROP POLICY IF EXISTS "anon_select_correspondencias" ON correspondencias;
    DROP POLICY IF EXISTS "auth_all_correspondencias" ON correspondencias;
    CREATE POLICY "anon_select_correspondencias" ON correspondencias FOR SELECT USING (true);
    CREATE POLICY "auth_all_correspondencias" ON correspondencias FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;
