import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function setup() {
    console.log("=== INICIANDO CRIAÇÃO AUTOMÁTICA DE ADMIN ===");

    // Usamos um timestamp para garantir que o email é 100% virgem no banco
    const uniqueEmail = `admin_${Date.now()}@ad-hoc.com`;
    const password = 'admin123';

    console.log(`1. Registrando novo usuário: ${uniqueEmail} ...`);

    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: uniqueEmail,
        password: password
    });

    if (authErr) {
        console.error("❌ Erro ao criar usuário no Auth:", authErr.message);
        return;
    }

    const userId = authData.user.id;
    console.log(`✅ Usuário criado com sucesso no Cofre (UUID: ${userId})`);

    console.log(`\n2. Inserindo perfil na tabela 'staff' ...`);
    const adminProfile = {
        id: userId,
        code: '0000',
        name: 'Administrador Supremo',
        email: uniqueEmail,
        phone: '(00) 00000-0000',
        role: 'Diretoria',
        regime: 'CLT'
    };

    const { error: dbErr } = await supabase.from('staff').insert(adminProfile);

    if (dbErr) {
        console.error("❌ Erro ao vincular perfil na tabela staff:", dbErr.message);
        return;
    }

    console.log("✅ Perfil staff criado e vinculado ao UUID com sucesso!");

    console.log("\n=============================================");
    console.log("🎉 TUDO PRONTO! USE AS CREDENCIAIS ABAIXO NO SEU APP:");
    console.log("EMAIL: " + uniqueEmail);
    console.log("SENHA: " + password);
    console.log("=============================================\n");
}

setup();
