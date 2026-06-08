import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vamenfwxyahwckkuspcl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbWVuZnd4eWFod2Nra3VzcGNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjIyNjE4NCwiZXhwIjoyMDkxODAyMTg0fQ.FqF6lLnRYX5Om1OzJEV-hL10saQyT6mAu1Lx2CPEGuc';

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const DEFAULT_ROLE = 'Portaria';

async function run() {
    console.log('=== IMPORTAÇÃO: Auth Users → Tabela Staff ===\n');

    console.log('1. Listando todos os usuários do Auth...');
    const { data: { users }, error: authError } = await adminClient.auth.admin.listUsers({
        perPage: 1000
    });

    if (authError) {
        console.error('❌ Erro ao listar usuários do Auth:', authError.message);
        return;
    }

    console.log(`   Encontrados ${users.length} usuários no Auth.\n`);
    users.forEach(u => console.log(`   - ${u.email} (id: ${u.id})`));

    console.log('\n2. Listando staffs existentes...');
    const { data: existingStaff, error: staffError } = await adminClient
        .from('staff')
        .select('id, email');

    if (staffError) {
        console.error('⚠️  Erro ao ler tabela staff:', staffError.message);
        console.log('   A tabela pode estar vazia ou com estrutura diferente. Inserindo mesmo assim...\n');
    }

    const existingEmails = new Set((existingStaff || []).map(s => (s.email || '').toLowerCase()));
    console.log(`   Staffs existentes: ${existingStaff?.length || 0}\n`);

    console.log('3. Inserindo staffs faltantes...\n');

    let criados = 0;
    let ignorados = 0;
    let erros = 0;

    for (const user of users) {
        const email = (user.email || '').toLowerCase();

        if (!email) {
            console.log(`⚠️  Usuário ${user.id} não tem email, pulando.`);
            ignorados++;
            continue;
        }

        if (existingEmails.has(email)) {
            console.log(`ℹ️  ${email} já existe na tabela staff.`);
            ignorados++;
            continue;
        }

        const name = user.user_metadata?.name
            || user.user_metadata?.full_name
            || email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        const role = user.user_metadata?.role || DEFAULT_ROLE;

        const staffProfile = {
            id: user.id,
            code: String(criados + 1).padStart(4, '0'),
            name: name,
            email: email,
            phone: user.user_metadata?.phone || '',
            role: role,
            regime: 'CLT',
            contracttype: 'Undetermined',
            admissiondate: new Date().toISOString(),
            isactive: true
        };

        const { error: insertError } = await adminClient.from('staff').upsert(staffProfile);

        if (insertError) {
            console.error(`❌ Erro ao inserir ${email}:`, insertError.message);
            erros++;
        } else {
            console.log(`✅ Inserido: ${name} (${email}) → ${role}`);
            criados++;
        }
    }

    console.log('\n=================================');
    console.log('=== RESUMO ===');
    console.log(`Inseridos: ${criados}`);
    console.log(`Ignorados (já existiam): ${ignorados}`);
    console.log(`Erros: ${erros}`);
    console.log('=================================\n');

    console.log('4. Verificando tabela staff...');
    const { data: finalStaff, error: finalErr } = await adminClient.from('staff').select('id, name, email, role');
    if (finalErr) {
        console.error('❌ Erro ao verificar:', finalErr.message);
    } else {
        console.log(`   Total de staffs: ${finalStaff.length}`);
        finalStaff.forEach(s => console.log(`   - ${s.name} (${s.email}) → ${s.role}`));
    }

    console.log('\n✅ Importação concluída! Agora tente fazer login novamente.');
}

run();
