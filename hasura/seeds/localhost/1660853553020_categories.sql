SET check_function_bodies = false;
INSERT INTO public.categories (id, name, created_at, updated_at, deleted_at) VALUES (1, 'Solar', '2022-08-17 23:29:57.521136', '2022-08-17 23:29:57.521136', NULL);
INSERT INTO public.categories (id, name, created_at, updated_at, deleted_at) VALUES (2, 'Auto Insurance', '2022-08-17 23:29:57.521136', '2022-08-17 23:29:57.521136', NULL);
INSERT INTO public.categories (id, name, created_at, updated_at, deleted_at) VALUES (3, 'Loans', '2022-08-17 23:29:57.521136', '2022-08-17 23:29:57.521136', NULL);
SELECT pg_catalog.setval('public.categories_id_seq', 3, true);
