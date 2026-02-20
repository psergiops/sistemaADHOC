import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostico() {
    const emailToTest = 'test-admin@ad-hoc.com';
    console.log(`Testando login para: ${emailToTest}`);

    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: emailToTest,
        password: 'admin123'
    });

    if (authErr) {
        fs.writeFileSync('debug-result.json', JSON.stringify({ step: 1, error: authErr.message }, null, 2));
        console.error("❌ Erro:", authErr.message);
    } else {
        console.log("✅ SUCESSO! UID:", authData.user.id);
        const { data: staffData } = await supabase.from('staff').select('id, name').eq('id', authData.user.id).single();
        fs.writeFileSync('debug-result.json', JSON.stringify({ step: 1, success: true, user: authData.user.id, staff: staffData }, null, 2));
    }
}

diagnostico();
