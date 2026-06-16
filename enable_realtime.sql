-- =============================================
-- HABILITAR REALTIME PARA TODAS AS TABELAS
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

-- Adiciona todas as tabelas à publicação supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE 
  staff,
  clients,
  shifts,
  transactions,
  paystubs,
  announcements,
  change_requests,
  vehicle_checklists,
  patrols,
  posts,
  entry_logs,
  guest_lists,
  reservations,
  material_requests,
  packages,
  correspondencias,
  inventory_items,
  inventory_movements,
  audit_logs;

-- =============================================
-- Opcional: garantir REPLICA IDENTITY para
-- que UPDATE/DELETE funcionem corretamente
-- =============================================
-- ALTER TABLE staff REPLICA IDENTITY FULL;
-- ALTER TABLE clients REPLICA IDENTITY FULL;
-- (repita para cada tabela se necessário)
