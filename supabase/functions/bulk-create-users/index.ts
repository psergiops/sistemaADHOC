
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Trata requisições OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { users } = await req.json()

    // O Supabase injeta automaticamente essas variáveis no ambiente da função
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log(`🚀 Iniciando criação de ${users.length} usuários...`)
    const results = []

    for (const user of users) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { 
          name: user.name, 
          role: user.role,
          must_change_password: true,
          initial_password: user.password
        }
      })

      if (error) {
        // Se o erro for que o usuário já existe, vamos tentar buscar o ID dele
        if (error.message.includes('already exists') || error.status === 422) {
          const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = listData?.users.find(u => u.email === user.email)
          
          if (existingUser) {
            console.log(`🔗 Usuário já existia, vinculado ID: ${user.email}`)
            results.push({ email: user.email, status: 'success', id: existingUser.id })
          } else {
            results.push({ email: user.email, status: 'error', message: error.message })
          }
        } else {
          console.error(`❌ Erro ao criar ${user.email}:`, error.message)
          results.push({ email: user.email, status: 'error', message: error.message })
        }
      } else {
        console.log(`✅ Usuário criado: ${user.email}`)
        results.push({ email: user.email, status: 'success', id: data.user.id })
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
