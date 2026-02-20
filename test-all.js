import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAll() {
    const results = {};

    let res = await supabase.auth.signInWithPassword({ email: 'admin@ad-hoc.com', password: 'admin' });
    results['admin@ad-hoc.com_admin'] = res.error ? res.error.message : 'OK ' + res.data.user.id;

    res = await supabase.auth.signInWithPassword({ email: 'admin@ad-hoc.com', password: 'admin123' });
    results['admin@ad-hoc.com_admin123'] = res.error ? res.error.message : 'OK ' + res.data.user.id;

    res = await supabase.auth.signInWithPassword({ email: 'test-admin@ad-hoc.com', password: 'admin' });
    results['test-admin@ad-hoc.com_admin'] = res.error ? res.error.message : 'OK ' + res.data.user.id;

    res = await supabase.auth.signInWithPassword({ email: 'test-admin@ad-hoc.com', password: 'admin123' });
    results['test-admin@ad-hoc.com_admin123'] = res.error ? res.error.message : 'OK ' + res.data.user.id;

    fs.writeFileSync('test-all-results.json', JSON.stringify(results, null, 2));
    console.log("Done.");
}

testAll();
