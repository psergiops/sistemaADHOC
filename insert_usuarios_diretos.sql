
-- Colaborador: Enderson Lourenço da Silva (brancolourenco60@gmail.com) - Senha: 3321
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('2a785bd6-b3a0-4530-b201-0dd5cc475c0f', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'brancolourenco60@gmail.com', '$2b$10$Vr6QAEx1Mr1wJEbm1W7ZQeJLqZwuv0du7imVgKifgutJ3X2l.4SAe', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES ('2a785bd6-b3a0-4530-b201-0dd5cc475c0f', '2a785bd6-b3a0-4530-b201-0dd5cc475c0f', format('{"sub":"%s","email":"%s"}', '2a785bd6-b3a0-4530-b201-0dd5cc475c0f', 'brancolourenco60@gmail.com')::jsonb, 'email', '2a785bd6-b3a0-4530-b201-0dd5cc475c0f', now(), now(), now());

UPDATE public.staff SET id = '2a785bd6-b3a0-4530-b201-0dd5cc475c0f' WHERE id = 'sta-imp-1771550925059-77';


-- Colaborador: Reginaldo Cordeiro de Brito (nadinmcs@gmail.com) - Senha: 0237
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('44b48a72-89f0-40be-ba4f-153b9cf50037', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nadinmcs@gmail.com', '$2b$10$.kYGwyC2LN09rIa0QZXppeGhvG/0jNxzjVkzBieBqryKyNHVneui2', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES ('44b48a72-89f0-40be-ba4f-153b9cf50037', '44b48a72-89f0-40be-ba4f-153b9cf50037', format('{"sub":"%s","email":"%s"}', '44b48a72-89f0-40be-ba4f-153b9cf50037', 'nadinmcs@gmail.com')::jsonb, 'email', '44b48a72-89f0-40be-ba4f-153b9cf50037', now(), now(), now());

UPDATE public.staff SET id = '44b48a72-89f0-40be-ba4f-153b9cf50037' WHERE id = 'sta-imp-1771550925059-59';


-- Colaborador: Emanuel Vinicius de Souza (Vini-50cent@hotmail.com.br) - Senha: 1109
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('ad28e8c4-6aba-413a-a54c-1b1c95e97a58', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'Vini-50cent@hotmail.com.br', '$2b$10$SZ/FxIMegvGgODedDt0j4OIrLFH8w5.cfdlLGorKjFLiKpiuZVjE2', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES ('ad28e8c4-6aba-413a-a54c-1b1c95e97a58', 'ad28e8c4-6aba-413a-a54c-1b1c95e97a58', format('{"sub":"%s","email":"%s"}', 'ad28e8c4-6aba-413a-a54c-1b1c95e97a58', 'Vini-50cent@hotmail.com.br')::jsonb, 'email', 'ad28e8c4-6aba-413a-a54c-1b1c95e97a58', now(), now(), now());

UPDATE public.staff SET id = 'ad28e8c4-6aba-413a-a54c-1b1c95e97a58' WHERE id = 'sta-imp-1771550925059-22';


-- Colaborador: João Guilherme de jesus Gentile (gjoao316@gmail.com) - Senha: 4622
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('7c30c1de-1473-437f-9926-aec92e3c7e51', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'gjoao316@gmail.com', '$2b$10$zH.3LajGrmtMMbKZkt3e.OPcuP/U5Lndm.ZhFRyOPHqpLSUl5MZ5m', now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES ('7c30c1de-1473-437f-9926-aec92e3c7e51', '7c30c1de-1473-437f-9926-aec92e3c7e51', format('{"sub":"%s","email":"%s"}', '7c30c1de-1473-437f-9926-aec92e3c7e51', 'gjoao316@gmail.com')::jsonb, 'email', '7c30c1de-1473-437f-9926-aec92e3c7e51', now(), now(), now());

UPDATE public.staff SET id = '7c30c1de-1473-437f-9926-aec92e3c7e51' WHERE id = 'sta-imp-1771550925059-38';
