import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Precisamos do cliente normal para ler a tabela staff
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// E precisaremos do cliente secundário isolado (sem sessão) para criar as senhas
const adminAuthClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});

async function runBackfill() {
    console.log("=== INICIANDO CRIAÇÃO DE LOGINS FALTANTES ===");

    // 1. Busca todos os funcionários na tabela `staff`
    const { data: staffList, error: fetchErr } = await supabase.from('staff').select('id, name, email, cpf');

    if (fetchErr) {
        console.error("❌ Erro ao buscar colaboradores:", fetchErr.message);
        return;
    }

    if (!staffList || staffList.length === 0) {
        console.log("Nenhum colaborador encontrado na base.");
        return;
    }

    console.log(`Encontrados ${staffList.length} colaboradores na tabela 'staff'. Verificando quem precisa de login...`);

    let criados = 0;
    let ignorados = 0;
    let erros = 0;

    // 2. Tenta criar login para cada um
    // Se o email já existir no Auth, o signUp falha ou retorna o Auth existente (dependendo das configs),
    // mas de qualquer forma ele não quebra o loop.
    for (const member of staffList) {
        const cpf = member.cpf;

        if (!cpf) {
            console.log(`⚠️ Skiping ${member.name} (${member.email}) - Não possui CPF cadastrado.`);
            ignorados++;
            continue;
        }

        const cleanCpf = cpf.replace(/\D/g, '');
        let password = cleanCpf.substring(0, 4);
        if (password.length < 4) password = password.padEnd(4, '0');

        console.log(`\nGerando login para: ${member.name} (${member.email})`);

        // Vamos tentar logar primeiro para ver se já existe (não funciona com anon key as vezes, mas signUp sim)
        const { data: authData, error: authError } = await adminAuthClient.auth.signUp({
            email: member.email,
            password: password
        });

        if (authError) {
            if (authError.message.includes("User already registered")) {
                console.log(`ℹ️ O usuário ${member.email} já possui login criado.`);
                ignorados++;
            } else {
                console.error(`❌ Erro ao criar login para ${member.email}:`, authError.message);
                erros++;
            }
        } else {
            // Se gerou um ID novo no cofre que é diferente do ID na tabela,
            // tecnicamente precisaríamos equalizar. Mas se eles vieram pelo mock import, 
            // a forma certa é atualizar a tabela staff pra ter o novo UID.
            if (authData.user && authData.user.id !== member.id) {
                console.log(`🔄 Atualizando ID da tabela staff para bater com o Auth UID (${authData.user.id})...`);
                const { error: updateErr } = await supabase.from('staff')
                    .update({ id: authData.user.id })
                    .eq('id', member.id);

                if (updateErr) {
                    console.error("   ❌ Erro ao sincronizar ID:", updateErr.message);
                    erros++;
                    continue;
                }
            }
            console.log(`✅ Login gerado com sucesso! (Senha: ${password})`);
            criados++;
        }
    }

    console.log("\n=================================");
    console.log("=== RESUMO DA OPERAÇÃO ===");
    console.log(`Logins criados com sucesso: ${criados}`);
    console.log(`Colaboradores ignorados/já tinham: ${ignorados}`);
    console.log(`Erros: ${erros}`);
    console.log("=================================\n");
}

runBackfill();
