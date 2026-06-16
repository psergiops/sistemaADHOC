-- =============================================
-- HABILITAR REALTIME PARA TODAS AS TABELAS
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

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
  audit_logs,
  document_attachments,
  shift_handovers,
  performance_evaluations,
  residents;
