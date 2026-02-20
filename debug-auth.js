import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostico() {
    console.log("Iniciando diagnóstico da conta admin@ad-hoc.com...");

    // 1. Tenta logar via Auth
    console.log("\n[1] Tentando autenticar com senha...");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'admin@ad-hoc.com',
        password: 'admin123'
    });

    if (authErr) {
        fs.writeFileSync('debug-result.json', JSON.stringify({ step: 1, error: authErr }, null, 2));
        console.error("❌ Erro de Autenticação:", authErr.message, authErr.status);
    } else {
        console.log("✅ Autenticação SUCESSO! UID:", authData.user.id);
        fs.writeFileSync('debug-result.json', JSON.stringify({ step: 1, success: authData }, null, 2));

        // 2. Tenta puxar o perfil staff
        console.log("\n[2] Verificando vínculo na tabela 'staff'...");
        const { data: staffData, error: staffErr } = await supabase
            .from('staff')
            .select('id, name, role')
            .eq('id', authData.user.id)
            .single();

        if (staffErr) {
            fs.writeFileSync('debug-result.json', JSON.stringify({ step: 2, authUser: authData.user, error: staffErr }, null, 2));
            console.error("❌ Usuário logou, mas não foi encontrado na tabela 'staff' com esse UUID!", staffErr.message);
        } else {
            console.log("✅ Perfil encontrado!", staffData);
            fs.writeFileSync('debug-result.json', JSON.stringify({ step: 2, authUser: authData.user, staff: staffData }, null, 2));
        }
    }
}

diagnostico();
