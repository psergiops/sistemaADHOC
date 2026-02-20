import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
// We need bcryptjs to generate the encrypted passwords that Supabase expects
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSQL() {
    const { data: staffList } = await supabase.from('staff').select('id, name, email, cpf');

    let sqlStatements = [];

    for (const member of staffList) {
        if (!member.email) continue;
        const cpf = member.cpf;
        if (!cpf) continue;

        let password = cpf.replace(/\D/g, '').substring(0, 4);
        if (password.length < 4) password = password.padEnd(4, '0');

        // Supabase uses bcrypt for passwords
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        // Since we cannot run ExecuteSQL directly due to permissions,
        // we'll instruct the user to run this in the Supabase SQL Editor
        sqlStatements.push(`
-- Criando login para ${member.name} (${member.email}) - Senha: ${password}
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '${member.id}', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    '${member.email}', 
    '${encryptedPassword}', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    '${member.id}', 
    format('{"sub":"%s","email":"%s"}', '${member.id}', '${member.email}')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;
`);
    }

    fs.writeFileSync('create_missing_logins.sql', sqlStatements.join('\n'));
    console.log("SQL gerado em create_missing_logins.sql com " + sqlStatements.length + " usuarios.");
}

generateSQL().catch(console.error);
