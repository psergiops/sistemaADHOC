
-- ⚠️ SCRIPT DE REINICIALIZAÇÃO TOTAL (LOWERCASE FRIENDLY)
-- Este script usa nomes de colunas em minúsculo para evitar problemas de "Case Sensitivity" entre JS e Postgres.

-- 1. LIMPEZA TOTAL
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS shift_checkins CASCADE;
DROP TABLE IF EXISTS inventory_movements CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS material_requests CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS guest_lists CASCADE;
DROP TABLE IF EXISTS entry_logs CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS patrols CASCADE;
DROP TABLE IF EXISTS vehicle_checklists CASCADE;
DROP TABLE IF EXISTS change_requests CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS paystubs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- 2. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CRIAÇÃO DAS TABELAS (Colunas em snake_case/lowercase para compatibilidade máxima)

-- Tabela: STAFF
CREATE TABLE staff (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    email text,
    phone text,
    avatar text,
    
    -- Dados Pessoais (Map camelCase JS -> lowercase DB)
    birthdate text,
    birthplace text,
    maritalstatus text,
    race text,
    weight numeric,
    height numeric,
    bloodtype text,
    
    -- Contatos Extras
    emergencyphone text,
    educationlevel text,
    
    -- Dados Contratuais
    role text NOT NULL,
    sector text,
    regime text,
    contracttype text,
    contractenddate text,
    admissiondate text,
    preferredshifts jsonb DEFAULT '[]'::jsonb,
    
    -- Financeiro
    salary numeric DEFAULT 0,
    paymentday integer,
    takesadvance boolean DEFAULT false,
    advancevalue numeric DEFAULT 0,
    advanceday integer,
    
    -- Endereço (Flattened)
    zipcode text,
    street text,
    "number" text, -- number é palavra reservada em alguns contexts, mas ok como coluna. Usar aspas na criação garante.
    complement text,
    district text,
    city text,
    state text,

    -- Documentos (Flattened)
    cpf text,
    rg text,
    rgissuedate text,
    cnv text,
    pis text,
    cnhnumber text,
    cnhtype text,
    voterid text,
    reservistcertificate text,
    reservistnotapplicable boolean DEFAULT false,
    
    -- Parentesco
    fathername text,
    mothername text,
    dependents jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;

-- Tabela: CLIENTS
CREATE TABLE clients (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    contactperson text,
    email text,
    phone text,
    avatar text,
    
    -- Endereço
    zipcode text,
    street text,
    "number" text,
    district text,
    city text,
    state text,
    
    servicetype text,
    contractvalue numeric DEFAULT 0,
    contractstartdate text,
    paymentday integer,
    isactive boolean DEFAULT true,
    notes text,
    requiredstaffcount integer DEFAULT 0,
    assignedstaffids jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Tabela: SHIFTS
CREATE TABLE shifts (
    id text PRIMARY KEY,
    staffid text,
    customstaffname text,
    locationid text,
    station text,
    date text NOT NULL,
    starttime text NOT NULL,
    endtime text NOT NULL,
    type text,
    notes text,
    recurrenceid text
);
ALTER TABLE shifts DISABLE ROW LEVEL SECURITY;

-- Tabela: SUPPLIERS
CREATE TABLE suppliers (
    id text PRIMARY KEY,
    code text,
    name text NOT NULL,
    category text,
    contactperson text,
    email text,
    phone text,
    
    -- Endereço
    zipcode text,
    street text,
    "number" text,
    district text,
    city text,
    state text,
    
    notes text,
    isrecurring boolean DEFAULT false,
    contractvalue numeric DEFAULT 0,
    paymentday integer
);
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- Tabela: TRANSACTIONS
CREATE TABLE transactions (
    id text PRIMARY KEY,
    description text NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL,
    date text NOT NULL,
    category text,
    status text,
    relatedclientid text,
    relatedsupplierid text
);
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Tabela: PAYSTUBS
CREATE TABLE paystubs (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    referencemonth text,
    uploaddate text,
    url text,
    filename text
);
ALTER TABLE paystubs DISABLE ROW LEVEL SECURITY;

-- Tabela: ANNOUNCEMENTS
CREATE TABLE announcements (
    id text PRIMARY KEY,
    title text NOT NULL,
    content text,
    date text,
    authorname text,
    priority text
);
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;

-- Tabela: CHANGE_REQUESTS
CREATE TABLE change_requests (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    type text,
    status text,
    requestdate text,
    newdata jsonb DEFAULT '{}'::jsonb,
    description text,
    attachmenturl text,
    hrjustification text,
    resolvedat text
);
ALTER TABLE change_requests DISABLE ROW LEVEL SECURITY;

-- Tabela: VEHICLE_CHECKLISTS
CREATE TABLE vehicle_checklists (
    id text PRIMARY KEY,
    date text NOT NULL,
    staffid text NOT NULL,
    clientid text NOT NULL,
    vehiclemodel text,
    vehicleplate text,
    odometer numeric DEFAULT 0,
    fuellevel numeric DEFAULT 0,
    items jsonb DEFAULT '[]'::jsonb,
    photos jsonb DEFAULT '[]'::jsonb,
    generalnotes text
);
ALTER TABLE vehicle_checklists DISABLE ROW LEVEL SECURITY;

-- Tabela: PATROLS
CREATE TABLE patrols (
    id text PRIMARY KEY,
    date text NOT NULL,
    staffid text NOT NULL,
    clientid text NOT NULL,
    type text,
    report text,
    photos jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE patrols DISABLE ROW LEVEL SECURITY;

-- Tabela: POSTS
CREATE TABLE posts (
    id text PRIMARY KEY,
    authorid text NOT NULL,
    locationid text,
    content text,
    imageurl text,
    timestamp text,
    likes jsonb DEFAULT '[]'::jsonb,
    comments jsonb DEFAULT '[]'::jsonb
);
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Tabela: ENTRY_LOGS
CREATE TABLE entry_logs (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    type text,
    name text NOT NULL,
    document text,
    vehiclemodel text,
    vehicleplate text,
    timestamp text,
    registeredby text,
    notes text
);
ALTER TABLE entry_logs DISABLE ROW LEVEL SECURITY;

-- Tabela: GUEST_LISTS
CREATE TABLE guest_lists (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    residentname text,
    eventname text,
    date text,
    linktoken text,
    guests jsonb DEFAULT '[]'::jsonb,
    createdby text
);
ALTER TABLE guest_lists DISABLE ROW LEVEL SECURITY;

-- Tabela: RESERVATIONS
CREATE TABLE reservations (
    id text PRIMARY KEY,
    clientid text NOT NULL,
    resourcename text,
    date text,
    starttime text,
    endtime text,
    reservedby text,
    status text
);
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- Tabela: MATERIAL_REQUESTS
CREATE TABLE material_requests (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    clientid text NOT NULL,
    date text,
    items jsonb DEFAULT '[]'::jsonb,
    status text,
    notes text
);
ALTER TABLE material_requests DISABLE ROW LEVEL SECURITY;

-- Tabela: INVENTORY_ITEMS
CREATE TABLE inventory_items (
    id text PRIMARY KEY,
    code text NOT NULL,
    name text NOT NULL,
    quantity integer DEFAULT 0,
    minthreshold integer DEFAULT 0,
    category text
);
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;

-- Tabela: INVENTORY_MOVEMENTS
CREATE TABLE inventory_movements (
    id text PRIMARY KEY,
    itemid text NOT NULL,
    itemname text,
    type text,
    quantity integer,
    date text,
    referenceid text,
    performedby text,
    notes text
);
ALTER TABLE inventory_movements DISABLE ROW LEVEL SECURITY;

-- Tabela: SHIFT_CHECKINS
CREATE TABLE shift_checkins (
    id text PRIMARY KEY,
    staffid text NOT NULL,
    locationid text,
    checkintime text,
    shifttimereference text,
    date text,
    status text
);
ALTER TABLE shift_checkins DISABLE ROW LEVEL SECURITY;

-- Tabela: AUDIT_LOGS
CREATE TABLE audit_logs (
    id text PRIMARY KEY,
    timestamp text,
    actorid text,
    actorname text,
    actorrole text,
    action text,
    category text,
    targetname text,
    details text
);
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- GRANT PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
