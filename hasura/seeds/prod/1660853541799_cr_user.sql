SET check_function_bodies = false;
INSERT INTO public.cr_user (id, name, email, created_at, updated_at, deleted_at) VALUES (1, 'blakesyv01', 'blakesyv01@gmail.com', '2022-08-18 00:11:34.465726', '2022-08-18 00:11:34.465726', NULL);
SELECT pg_catalog.setval('public.cr_user_id_seq', 1, true);
