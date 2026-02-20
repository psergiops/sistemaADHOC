import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateDirectSQL() {
    const { data: staffList } = await supabase.from('staff').select('id, name, email, cpf');

    let sqlStatements = [];
    let count = 0;

    for (const member of staffList) {
        if (!member.email || !member.cpf || member.id.length === 36) continue;

        const cleanCpf = member.cpf.replace(/\D/g, '');
        let password = cleanCpf.substring(0, 4);
        if (password.length < 4) password = password.padEnd(4, '0');

        // Supabase uses bcrypt for passwords
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const newUuid = uuidv4();

        // Geramos inserts diretos sem depender de blocos PL/pgSQL
        sqlStatements.push(`
-- Colaborador: ${member.name} (${member.email}) - Senha: ${password}
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('${newUuid}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${member.email}', '${encryptedPassword}', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES ('${newUuid}', '${newUuid}', format('{"sub":"%s","email":"%s"}', '${newUuid}', '${member.email}')::jsonb, 'email', '${newUuid}', now(), now(), now());

UPDATE public.staff SET id = '${newUuid}' WHERE id = '${member.id}';
`);
        count++;
    }

    fs.writeFileSync('insert_usuarios_diretos.sql', sqlStatements.join('\n'));
    console.log(`SQL gerado com sucesso em insert_usuarios_diretos.sql para ${count} colaboradores.`);
}

generateDirectSQL().catch(console.error);
