
-- Criando login para Cristiano Egídio Galdino da Silva (cristianoegidiogaldino@gmail.com) - Senha: 2051
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-10', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'cristianoegidiogaldino@gmail.com', 
    '$2b$10$76iuSqSMcpM06tVC4NNLhOqsbJzg7.v9HavalczylSuOznYpWYS5q', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-10', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-10', 'cristianoegidiogaldino@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Leandro de Castro (lc302948@gmail.com) - Senha: 3331
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-45', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'lc302948@gmail.com', 
    '$2b$10$2y7cTFFALNGLcgcFPjoafuJ91ubAHRFdWG.10FROv1Gay58GwkK6e', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-45', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-45', 'lc302948@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Carlos Santos da silva (Kikosantos907@gmail.com) - Senha: 2832
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-9', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Kikosantos907@gmail.com', 
    '$2b$10$TKb29zh/gwgsgE4NzTg11u9MAYpBg1nS32suYO1X4vj6ZpQMud6.K', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-9', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-9', 'Kikosantos907@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Helda Alves da silva (heldaalvesdasilva9@gmail.com) - Senha: 2813
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-31', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'heldaalvesdasilva9@gmail.com', 
    '$2b$10$MElNQDNovFWStEz5wha.z.G39JD1eEn1QEaIBbUM87L.P3kaMZDz2', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-31', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-31', 'heldaalvesdasilva9@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jessé Martins (martins.jesse@hotmail.com) - Senha: 2766
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-35', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'martins.jesse@hotmail.com', 
    '$2b$10$/ntVwPbDKYhmEqMu0WLRZ.QHp1mWlsmBeZnRvsqTKEL/plJmjls3u', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-35', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-35', 'martins.jesse@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para INGRID RODRIGUES ALVES (ingridalves1214@gmail.com) - Senha: 8613
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-32', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'ingridalves1214@gmail.com', 
    '$2b$10$vBBsrA4.uhnF5iUl3TWhoOYUYih8p6KN1htqLfnbst2Tf7/lI9nZ6', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-32', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-32', 'ingridalves1214@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Antonio Barreto de Souza filho (Antoniobarreto059@gmail.com) - Senha: 4481
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-5', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Antoniobarreto059@gmail.com', 
    '$2b$10$13tZ5CnW6pQ9hbF9mqQ9nufSZ7ODw5MiTH4LqkwxV1wU4aPP12K6a', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-5', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-5', 'Antoniobarreto059@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Dejamil Custodio Bomfin (dejamilbonfim@gmail.com) - Senha: 1348
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-14', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'dejamilbonfim@gmail.com', 
    '$2b$10$NHHpKfmYIwUd7JBx0NMCiu2IRek/I3N085F/PrEsOuNBh8CjxMmVG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-14', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-14', 'dejamilbonfim@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Vagner Silveira Araujo Chaves (vagnerchaves0102@gmail.com) - Senha: 2960
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-68', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'vagnerchaves0102@gmail.com', 
    '$2b$10$hRnznx.D1.vwHgq8w0LlJuW2L.83afCj/987af98MLPTNREcVp8hW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-68', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-68', 'vagnerchaves0102@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Reginaldo Cordeiro de Brito (nadinmcs@gmail.com) - Senha: 0237
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-58', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'nadinmcs@gmail.com', 
    '$2b$10$kCUjHbyP62ETgXh/Mlf/3uOpEM9h9Vmwo8GiaZkyEK32hKZkDnWES', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-58', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-58', 'nadinmcs@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Luciara da Silva Oliveira (lucisilva1468@gmail.com) - Senha: 1367
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-50', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'lucisilva1468@gmail.com', 
    '$2b$10$9aDib1659gPWHMWrvhi1K.NVg.daYUhPaSqAfY3.03IzLpay0iP3W', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-50', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-50', 'lucisilva1468@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Gustavo pontes Furtado (Gustavopontesfurtado@gmail.com) - Senha: 3937
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-30', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Gustavopontesfurtado@gmail.com', 
    '$2b$10$iQ.RgzruDFmDUsJapac8y./tut.YbA208DS.QB1PTOeHEMbQrSqUa', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-30', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-30', 'Gustavopontesfurtado@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Deivid Junior de Souza Batista Teixeira (bryanmiguel2043@gmail.com) - Senha: 4231
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-13', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'bryanmiguel2043@gmail.com', 
    '$2b$10$oVvedHPHHLTMkYP3nNMpVuBuf1Eplo5mDZlGdPPmG47PFb491S/8.', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-13', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-13', 'bryanmiguel2043@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Lucas Conceição da Silva (lsfalcao.negro@gmail.com) - Senha: 3377
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-46', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'lsfalcao.negro@gmail.com', 
    '$2b$10$nfcO9bpeAAXTTdm1AM27Hushiftc.Prq7I.4NsjGwdhRIvg8O6PhW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-46', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-46', 'lsfalcao.negro@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Emanuel Vinicius de Souza (Vini-50cent@hotmail.com.br) - Senha: 1109
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-22', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Vini-50cent@hotmail.com.br', 
    '$2b$10$pO/BbGn96eOcf4IrV5ChRO1.TvXFEHHXF4c1QmwAYhfDcMPXb8TWy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-22', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-22', 'Vini-50cent@hotmail.com.br')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Lucas Rodrigues da cruz Borges (lukazborges235@gmail.com) - Senha: 4313
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-49', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'lukazborges235@gmail.com', 
    '$2b$10$MGtgiXVKNwT0.HNrrZ38SeuWnqfxPcRcFKmcwsRyjZvSDO4MmE.fa', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-49', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-49', 'lukazborges235@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Silvio Marques de souza (setembro722@gmail.com) - Senha: 1397
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-65', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'setembro722@gmail.com', 
    '$2b$10$IKx9NOZhB16Em.zEbNYxOeYe/QuEJmZIVL5GdJfJ2xGwzR9f3ZL/G', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-65', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-65', 'setembro722@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Rafael Luiz Lourenço de sena (rafaelsena.rafinha@gmail.com) - Senha: 3266
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-56', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'rafaelsena.rafinha@gmail.com', 
    '$2b$10$C16r8UstlM9fIlv.crgTXeRnuWEQn9NKvON.E4mbb2N.pUf.Avq3G', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-56', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-56', 'rafaelsena.rafinha@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Altair Fechete (altairccb2020@gmail.com) - Senha: 3049
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-2', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'altairccb2020@gmail.com', 
    '$2b$10$7n0bUeWT1EGcbaJ4hHzZqOuLfqmxIkGeTTaHdlaoRVCKT2IG.83Ei', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-2', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-2', 'altairccb2020@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Suelen Barrios do Espirito Santo (barrios_suelen87@hotmail.com) - Senha: 3521
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-66', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'barrios_suelen87@hotmail.com', 
    '$2b$10$eLumaVmyAm7jcJW7YgujhuAJJGmU2.INZKaQYKmXRbWwCLPdShme6', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-66', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-66', 'barrios_suelen87@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Vinicius Barbosa Rodrigues (vinicius.barbosa2713@gmail.com) - Senha: 4635
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-85', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'vinicius.barbosa2713@gmail.com', 
    '$2b$10$0LSQAWmXtIN0MHPjr1jkBexwTBjdMPUParK2RhwKFuQoIADqI.BrG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-85', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-85', 'vinicius.barbosa2713@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Vicente Domingos de jesus (Vicentedomingos180410@gmail.com) - Senha: 3114
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-69', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Vicentedomingos180410@gmail.com', 
    '$2b$10$7yIlfrOmj9Xfb.hTgPQGqu/l/eMhw5Y5OMYitzXQqM9I529qYjjRC', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-69', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-69', 'Vicentedomingos180410@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Alex wilson de souza (Alexws557souza@gmail.com) - Senha: 4232
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-1', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Alexws557souza@gmail.com', 
    '$2b$10$a9o6aa9eFsXrJqohoFDueuZP9sxOyVqaVc/1BEnJj8lv3qhKyi8fO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-1', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-1', 'Alexws557souza@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Valmir costa da silva (Valmircostadasilva1234@gmail.com) - Senha: 3637
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-81', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Valmircostadasilva1234@gmail.com', 
    '$2b$10$J9s8/0zYCHdE5AykhI.1oO7PocCpVKC.2iVVFnWpbaBs7eAq7/rYC', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-81', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-81', 'Valmircostadasilva1234@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Arlete Pereira de Souza (arletepereirasouza74@gmail.com) - Senha: 9740
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-8', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'arletepereirasouza74@gmail.com', 
    '$2b$10$SnTsinNsCzD9/RXKfnj/c.NajQBuqf5/rIU6i0A323UmHRlQOUcZy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-8', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-8', 'arletepereirasouza74@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Saulo Igor Silva (sauloigor250@gmail.com) - Senha: 3767
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-62', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'sauloigor250@gmail.com', 
    '$2b$10$8UHcolq2dGxPQEw5TgtEb.fehkJrDShy.LdgG7SpbcsNkN3N78/nu', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-62', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-62', 'sauloigor250@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Ivanildo Almeida da Silva (ivan.meida@gmail.com) - Senha: 2817
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-78', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'ivan.meida@gmail.com', 
    '$2b$10$YwoLmIjxELEdvPjryCz2BewPgRDA5decHzam5UupjJ2n8E/BjVxH.', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-78', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-78', 'ivan.meida@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jovino santos do Prado (jovinosantosprado@gmail.com) - Senha: 6567
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-43', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'jovinosantosprado@gmail.com', 
    '$2b$10$Fg5z32.vX/OZL0JNUkWYuuhSF5fHpLJWVMdRae9Hq5nIxIOY./jsy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-43', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-43', 'jovinosantosprado@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Gilson dos Santos Freitas (Gilssf1981@gmail.com) - Senha: 2221
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-28', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Gilssf1981@gmail.com', 
    '$2b$10$VvJ0EG9OZQIbTBIeC5ngIOR5kA9xRssZzAQZjOdPDoyuKNRR0iBVq', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-28', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-28', 'Gilssf1981@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Marcos Nogueira Souza (marcosnogueira2324@gmail.com) - Senha: 3351
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-54', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'marcosnogueira2324@gmail.com', 
    '$2b$10$655wfPLBcpzCGW9.r0VpCuPlFMQmTjUOQ0P/XxEpfj6LFW/TFvpBG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-54', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-54', 'marcosnogueira2324@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jasson Evangelista Souza Junior (jassonjrsouza@gmail.com) - Senha: 1637
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-33', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'jassonjrsouza@gmail.com', 
    '$2b$10$LS1MIWfGMRlNy4i24LO9geeqybB72LOejf.yQIZNfMkcIL60DrlEy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-33', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-33', 'jassonjrsouza@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Sergio Luis Giorgi (sergio.lucia_rafa@terra.com.br) - Senha: 1253
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-64', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'sergio.lucia_rafa@terra.com.br', 
    '$2b$10$zHmLSS45LHxOUpPdojzKr.c4LMxQh9kTmpUfFcuFW3fr7PAywVbOm', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-64', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-64', 'sergio.lucia_rafa@terra.com.br')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Felipe Nunes Pereira (nunessegprivada@gmail.com) - Senha: 5003
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-24', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'nunessegprivada@gmail.com', 
    '$2b$10$qF2vxoRKbukGwI9JiFBJoOTWWTPV6AK..6lI6E7L5srm9Iwc1v.xq', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-24', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-24', 'nunessegprivada@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Lucas Rafael Rodrigues de Lima (limalucasrafael34@gmail.com) - Senha: 4406
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-48', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'limalucasrafael34@gmail.com', 
    '$2b$10$3SDFF/jrvUPdv8xYgnnOQu0ko46tL.3cR.wJudk7ald9v1IhmIbPG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-48', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-48', 'limalucasrafael34@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para João Pedro Carvalho de Moraes (pedrocarvalhomoraes3@gmail.com) - Senha: 5720
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-76', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'pedrocarvalhomoraes3@gmail.com', 
    '$2b$10$hKTVDfnbbT2BcP./giJVreMljciKfCMN8A5LoAQtX6j0QZqqUFj2K', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-76', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-76', 'pedrocarvalhomoraes3@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Fabiano Gouveia Vieira (fabianogouveiavieira@gmail.com) - Senha: 4451
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-73', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'fabianogouveiavieira@gmail.com', 
    '$2b$10$.9sHj7opLm660UWjC5x4cORqPxocr57FGc/QsLNWm9PTUTMrp5Zvy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-73', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-73', 'fabianogouveiavieira@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Francisco Valter Jerônimo Gomes (valtermarkgomes@hotmail.com) - Senha: 3268
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-27', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'valtermarkgomes@hotmail.com', 
    '$2b$10$D0R8yLdPgtQZQHRx7LYCderh9dGC2odDgCyXx.qgHVxMu8pHnDKre', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-27', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-27', 'valtermarkgomes@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Marcos Aurélio De Carvalho (mmarcosaurelio1210@gmail.com) - Senha: 2476
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-52', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'mmarcosaurelio1210@gmail.com', 
    '$2b$10$iRis0cPQc5ObWzvyaHTJBOI14KUPwb7ncrgW5RQsHSs5xBY94vPt2', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-52', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-52', 'mmarcosaurelio1210@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Graciola dos santos Fernandes (gracioladossantos67@gmail.com) - Senha: 2676
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-29', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'gracioladossantos67@gmail.com', 
    '$2b$10$6lE6xgyQGZkR.pfphhICiemTGQhj549TMY05lo.nTapllzgoU9MWW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-29', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-29', 'gracioladossantos67@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Victor leite de Andrade (victorandradedrinoah@gmail.com) - Senha: 4976
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-70', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'victorandradedrinoah@gmail.com', 
    '$2b$10$QzBefbgaqh/Jnav.eg/gwu.9SkqAn9rZLCVDf2tjGBXg6L9n.nTSi', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-70', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-70', 'victorandradedrinoah@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Alvaro Duarte Junior (junior.duarte.ju@gmail.com) - Senha: 3710
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-3', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'junior.duarte.ju@gmail.com', 
    '$2b$10$Ail05foJS7fiP6tX4UoLpeYF/bCLro9G1inEcBfJM0fPNmOf/0Ynu', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-3', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-3', 'junior.duarte.ju@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Gustavo Pontes Furtado (Gucajuli@gmail.com) - Senha: 3937
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-86', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Gucajuli@gmail.com', 
    '$2b$10$7I1rFnoKwgqENUKxb.lLPOfI6ns8eIT296ZWzxOnsyRvj.DIom78u', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-86', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-86', 'Gucajuli@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Ulisses Andersom de Almeida Novaes (ulissesanderson43@gmail.com) - Senha: 2263
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-67', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'ulissesanderson43@gmail.com', 
    '$2b$10$ohvhu.YR6f8jnQBUhoBYH.rKuKqBvJbCExLsw6XPT3EL4KWRMpYZy', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-67', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-67', 'ulissesanderson43@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Divaldo Sousa Barbosa (divaldosousabarbosape@gmail.com) - Senha: 4786
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-16', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'divaldosousabarbosape@gmail.com', 
    '$2b$10$mYOiDZGDSUXnZlVsOl1Eju9fKyjfPLRNeAfqv4WgCaCs/Fn7i6jtG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-16', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-16', 'divaldosousabarbosape@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para JOSE LUZIARIO DOS SANTOS (luziariobej@hotmail.com) - Senha: 7940
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-41', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'luziariobej@hotmail.com', 
    '$2b$10$YDDeJXbhOi4KvNO9QKvj/O77MxFkVBIPGDr6aNopJsNXaCsFP.hLm', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-41', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-41', 'luziariobej@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Antonio Vagner Mascarenhas Oliveira (oliveiradasilvaa687@gmail.com) - Senha: 5571
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-7', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'oliveiradasilvaa687@gmail.com', 
    '$2b$10$q2ombDrnoIbBWpG3goNcqOYByWM1q70vdCkV2LFOB0/qYDPDd6wtS', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-7', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-7', 'oliveiradasilvaa687@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Antônio Dalvaro Soares da Silveira (dalvaroantonio45@gmail.com) - Senha: 3274
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-6', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'dalvaroantonio45@gmail.com', 
    '$2b$10$GOqp7UwYAIAuucncQeTeKufbJ3Dtt1G1dbqmjq/nOfKrqFxklBSh6', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-6', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-6', 'dalvaroantonio45@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Enderson Lourenço da Silva (brancolourenco60@gmail.com) - Senha: 3321
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-23', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'brancolourenco60@gmail.com', 
    '$2b$10$vTi/FiUwuLBQrRGKog9vAuNof/3fPeovEXb/9m7vifv0Zk47yF0Pq', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-23', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-23', 'brancolourenco60@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Diogo Dias da Silva Santos (diogossantos2112@gmail.com) - Senha: 3049
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-15', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'diogossantos2112@gmail.com', 
    '$2b$10$42yMg3PWNpJ7Go9XjfmJP.3eTlBv1Cd0xztWCkFUuFwmUJJ3Aj8me', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-15', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-15', 'diogossantos2112@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para WELLINGTHON APARECIDO DA CRUZ (cruzw6674@gmail.com) - Senha: 4352
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-71', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'cruzw6674@gmail.com', 
    '$2b$10$XqrxNwOM65ynpDys41IeuupAc/NkZ/V1I3wdB9I/5Dy.9s4epRwLW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-71', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-71', 'cruzw6674@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Joao Paulo de Moraes (joao1603@gmail.com) - Senha: 2296
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-74', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'joao1603@gmail.com', 
    '$2b$10$rUgAW0BHnn/UnGd8Zh3sle9/P08pFPkPkuLG.kRGTfyxnt.wGWxkO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-74', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-74', 'joao1603@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Rafael Fernandes da Silva (rlfs.fernandes@gmail.com) - Senha: 3624
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-55', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'rlfs.fernandes@gmail.com', 
    '$2b$10$VNhvcBAJ2GU6YRNSm2zq4.ZZc.5Ozmvg4Z0CnL1Qnw1UwXH.3k40e', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-55', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-55', 'rlfs.fernandes@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Marcos Marcelino da Silva (mmdasilva2302@gmail.com) - Senha: 2738
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-53', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'mmdasilva2302@gmail.com', 
    '$2b$10$64sRF4GUTwlF4fpN4fOLC.EgKGJ759DRPMpCG9xEzKweuccWddILi', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-53', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-53', 'mmdasilva2302@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Julio Cesar de Oliveira Santos (baggiofile0505@gmail.com) - Senha: 2951
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-44', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'baggiofile0505@gmail.com', 
    '$2b$10$b8FwFP5ig67p3Hk2X5VBU.HdnG4YbX4lUdVF99a21R3Ba0VaK.3mm', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-44', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-44', 'baggiofile0505@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para José Suelânio Da Silva Bernardino (suelanio.j@gmail.com) - Senha: 4137
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-42', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'suelanio.j@gmail.com', 
    '$2b$10$rsSrSuwerOiZXc.rjZAINeSHzwYAKKGpno2lbl7hJsFQakiLUekBO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-42', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-42', 'suelanio.j@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para João Guilherme de jesus Gentile (gjoao316@gmail.com) - Senha: 4611
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-79', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'gjoao316@gmail.com', 
    '$2b$10$Q8A/qgYYD4sS.tGbMkZPgOouHJ/RXV3B7U7CIpk/DuZJAUxuDdtKO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-79', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-79', 'gjoao316@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Bruno de Paulo Santos (brunoabc16@outlook.com) - Senha: 3883
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-84', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'brunoabc16@outlook.com', 
    '$2b$10$6khOXJ5EbPlWyugkWtaCXu21VUEXEKUV0R.I/DPSVcl5SEeutzZme', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-84', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-84', 'brunoabc16@outlook.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para João Guilherme de jesus Gentile (gjoao316@gmail.com) - Senha: 4622
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-38', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'gjoao316@gmail.com', 
    '$2b$10$LZNtI6DCK7dj0oAkWUmOf.nQjyUWraQ3dLJK0Te8Z7Lb9uJbAKw7i', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-38', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-38', 'gjoao316@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jeferson Santiago Santos (jefersonsantiago2109@gmail.com) - Senha: 4779
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-34', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'jefersonsantiago2109@gmail.com', 
    '$2b$10$irAfF5229YhovHLolAFTiuVtAnnbWmQqKYtzj65TrjBAYOmHR7FjO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-34', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-34', 'jefersonsantiago2109@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Robson Santos de Souza (robsonsantossouza35.12345@gmail.com) - Senha: 3396
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-60', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'robsonsantossouza35.12345@gmail.com', 
    '$2b$10$wYDsyxrcQvt7PsYwdM7E5OzYFKJzofRZrIy7rw0dJGZawCsqPX49i', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-60', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-60', 'robsonsantossouza35.12345@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jonatas Henrique Vilar Silva (Jonatashenrique642@gmail.com) - Senha: 5505
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-40', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Jonatashenrique642@gmail.com', 
    '$2b$10$cb.M0iA3oUYhSjKYQneCC.JzvQSttE0aZbteD0hnifBv3LU0NAeiO', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-40', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-40', 'Jonatashenrique642@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Eduardo Tadeu Malheiro dos Santos (edu.gestfin@gmail.com) - Senha: 2663
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-19', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'edu.gestfin@gmail.com', 
    '$2b$10$5qvwvNp9G0pnCkR2ilqAp.FC/pagWG3hzZKvyGdwbxYR7NznFTuVS', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-19', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-19', 'edu.gestfin@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Raimundo Silva Santos (Raimundo.isabely01@mali.com) - Senha: 1789
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-57', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Raimundo.isabely01@mali.com', 
    '$2b$10$tLdEi0WCA.llNEBrAt.xpeS0yMORfau719tAsDfpNCnndptX21x9i', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-57', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-57', 'Raimundo.isabely01@mali.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jose Augusto da Silva (augusto.silva1911@gmail.com) - Senha: 2679
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-80', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'augusto.silva1911@gmail.com', 
    '$2b$10$eGcuip4w5DNuWWB573Lmi.MpZHRihkn1bKD159qx6LzCYXVC1QbaS', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-80', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-80', 'augusto.silva1911@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Çristiano Ramos de Souza (Cristianosouza.cbe@gmail.com) - Senha: 2059
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-11', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Cristianosouza.cbe@gmail.com', 
    '$2b$10$FsbVdzcFqXhh3/GTyqtth.zHZ56NWG12ZBgYcQ7N46j/Rwq0MxpxW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-11', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-11', 'Cristianosouza.cbe@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Enderson Lourenço da Silva (brancolourenco60@gmail.com) - Senha: 3321
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-77', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'brancolourenco60@gmail.com', 
    '$2b$10$bXkwF5qN5lL1kTuHgX/w9O.rolsWL4XS5l893FcmQJFJ65/deztGG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-77', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-77', 'brancolourenco60@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para João Xavier da Silva (Joaoxavier-silva@hotmail.com) - Senha: 7938
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-39', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Joaoxavier-silva@hotmail.com', 
    '$2b$10$NkjSqG4oxYxi.Jv9UYskZ.w1Lq8ncf2UWvVhHqis2tmF2VZmzc/gC', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-39', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-39', 'Joaoxavier-silva@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Filipe soares Lemos (felipesoares14.fs@gmail.com) - Senha: 4243
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-26', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'felipesoares14.fs@gmail.com', 
    '$2b$10$Mbggdjy4klAJU9pyuJd5bOC6vM5cm4Ff.yqeRWv/.2cGGApVeplKK', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-26', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-26', 'felipesoares14.fs@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Jessica de Souza Martins (jessica.smartins.425@gmail.com) - Senha: 3947
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-36', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'jessica.smartins.425@gmail.com', 
    '$2b$10$Y1N5OZOW.ETSC4zdDxp2Z.F7mZQm3BpgIZQTHagSlse7nJT.e2b02', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-36', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-36', 'jessica.smartins.425@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Décio de Souza Araújo (deciocohab5@gmail.com) - Senha: 2807
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-12', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'deciocohab5@gmail.com', 
    '$2b$10$UMWg9jDB2kwPvkejUmNvJ.2zQQsO1yJqiwS0FI52QgLR05LCuPaUC', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-12', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-12', 'deciocohab5@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Fernando santos dias (Flexnandopauta@gmail.com) - Senha: 4983
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-25', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Flexnandopauta@gmail.com', 
    '$2b$10$uE73jxBJZeUeGPyQLiPPzOX8FEDGmHOkNj9eL9vpTtiEEfMhzP5mi', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-25', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-25', 'Flexnandopauta@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Daniel damasceno pereira (danielkarolhellena@gmail.com) - Senha: 4048
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-83', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'danielkarolhellena@gmail.com', 
    '$2b$10$/zRyPUn3i/XxrbzEbTDt1.eRG1o1vxXX5vrnLV0oQS72wS5JPG0r2', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-83', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-83', 'danielkarolhellena@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Marcos Flávio Ferreira (mflavio2.mf@gmail.com) - Senha: 1407
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-87', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'mflavio2.mf@gmail.com', 
    '$2b$10$LRFIz3WrtaMPBdgdYzeYAekoNYRpdLCnMbDCt5SyO8gcD30ox8XGG', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-87', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-87', 'mflavio2.mf@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para João Fernandes Da Silva Neto (Joaofsn17@gmail.com) - Senha: 0843
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-37', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Joaofsn17@gmail.com', 
    '$2b$10$i.JHdr7J2O34pFprk9M.TuDDWfLRPxBWcAjnWg0ccQB0kC09GTWhW', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-37', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-37', 'Joaofsn17@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Edson Cardoso Vieira (Edsonviu@hotmail.com) - Senha: 9657
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-72', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Edsonviu@hotmail.com', 
    '$2b$10$ocA9PpAJtGUnUvE59iN.beiQn41byJN.LlxdnvYHZh9u8a.Dx3LKC', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-72', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-72', 'Edsonviu@hotmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Dorival David de Oliveira Prado (dorivalarturdavi@gmail.com) - Senha: 3272
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-17', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'dorivalarturdavi@gmail.com', 
    '$2b$10$XI816quMEMj5MR7OgPDpFurmWrx92eUrFNMhrJAspsaVMoef8n4Di', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-17', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-17', 'dorivalarturdavi@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Anderson de Jesus Vieira Queirolo (supervisorqueirolo@gmail.com) - Senha: 3403
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-4', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'supervisorqueirolo@gmail.com', 
    '$2b$10$RZ.l/IfC2MKK7OvTIAknguIHtLOY6/09Q983RmIIyDwA.Sy2eVL76', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-4', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-4', 'supervisorqueirolo@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Franklin Rodrigo correia santos costa (franklinrodrigo48@gmail.com) - Senha: 3880
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-75', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'franklinrodrigo48@gmail.com', 
    '$2b$10$vdFBCNXv9ITDGTC2dft3pOnrD9PCQ8YPXgOpS.49azZRqA.6r19/2', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-75', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-75', 'franklinrodrigo48@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Eduardo Moraes dos Santos (Eduardomoraesdossantos577@gmail.com) - Senha: 5442
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-18', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Eduardomoraesdossantos577@gmail.com', 
    '$2b$10$AdDA0GHv5bWsV5FaAYXgSuCSdeQ2E5MU3TYayRJYfGy6.DY6z9XpK', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-18', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-18', 'Eduardomoraesdossantos577@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Lucas Jordy Marques Gonçalves (Lucasjordymarques@gmail.com) - Senha: 4267
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-47', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Lucasjordymarques@gmail.com', 
    '$2b$10$w6o65y/PZOIbc0OAeraJdezq04lEyvMBXjoOyZhi2VYhVlq4UALKS', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-47', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-47', 'Lucasjordymarques@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Marco Antônio de Andrade (Antoniomarcoandrade3@gmail.com) - Senha: 5814
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-51', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Antoniomarcoandrade3@gmail.com', 
    '$2b$10$HouHNRQLgpNbSfiUiYRfU./sYZz/fVjAnunT.tsHKL1q2KH.ew1Ce', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-51', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-51', 'Antoniomarcoandrade3@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Reginaldo Cordeiro de Brito (nadinmcs@gmail.com) - Senha: 0237
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-59', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'nadinmcs@gmail.com', 
    '$2b$10$e9EQ1J0pBi/dXMSLePLPremjQQOoBmMJA31W5WeQseOx2XXiuiQcu', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-59', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-59', 'nadinmcs@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Emerson Barbosa Costa (Emerson Barbosa Costa) - Senha: 1675
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215194-82', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Emerson Barbosa Costa', 
    '$2b$10$nCc3/3BqAgu0XC67bJlG0eJ7CtkX.j9Kq/PYwxyTq7kuLYCIMtoj2', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215194-82', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215194-82', 'Emerson Barbosa Costa')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Saulo Souza Sanches (saulossanches@gmail.com) - Senha: 4299
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-63', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'saulossanches@gmail.com', 
    '$2b$10$N4IEZZ7Pc7ImCLBmmsdtH.U/c4rVqUuJV57YHuehDBADrB2GdBTPe', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-63', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-63', 'saulossanches@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;


-- Criando login para Rodges nascimento Ribeiro (Rodgerribeiro0@gmail.com) - Senha: 4935
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    'sta-imp-1771550215193-61', 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'Rodgerribeiro0@gmail.com', 
    '$2b$10$goreMHff7yf6MiS8si15gO3pumieVSgs7oABS7mTt.WZEnoBUZ4k.', 
    now(), 
    now(), 
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'sta-imp-1771550215193-61', 
    format('{"sub":"%s","email":"%s"}', 'sta-imp-1771550215193-61', 'Rodgerribeiro0@gmail.com')::jsonb, 
    'email', 
    now(),
    now(), 
    now()
) ON CONFLICT (provider, id) DO NOTHING;
