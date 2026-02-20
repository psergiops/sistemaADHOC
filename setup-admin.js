import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
    const email = 'admin@ad-hoc.com';
    const password = 'admin123'; // Increased length to meet Supabase policy

    console.log('1. Realizando SignUp no Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        if (authError.message.includes('User already registered')) {
            console.log('=> Usuário já registrado no Auth.');
        } else {
            console.error('Erro no SignUp:', authError);
            return;
        }
    } else {
        console.log('=> SignUp concluído!', authData?.user?.id);
    }

    let userId = authData?.user?.id;
    if (!userId) {
        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (loginErr) {
            console.error('Falha ao logar para recuperar ID:', loginErr);
            return;
        }
        userId = loginData?.user?.id;
        console.log('=> Login efetuado para recuperar ID:', userId);
    }

    console.log('\n2. Inserindo Perfil na tabela staff...');
    const adminProfile = {
        id: userId,
        code: '0000',
        name: 'Administrador do Sistema',
        email: email,
        phone: '(00) 00000-0000',
        role: 'Diretoria',
        regime: 'CLT',
        contracttype: 'Undetermined',
        admissiondate: new Date().toISOString()
    };

    const { error: dbError } = await supabase.from('staff').upsert(adminProfile);

    if (dbError) {
        console.error('Erro ao inserir na tabela staff:', dbError);
    } else {
        console.log('=> Perfil de administrador inserido com sucesso!');
    }

    console.log('\n✅ Setup completo! Tente logar com admin@ad-hoc.com / admin123');
}

setupAdmin();
