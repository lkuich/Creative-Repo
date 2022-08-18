SET check_function_bodies = false;
INSERT INTO public.asset (id, category_id, platform, media_id, created_at, updated_at, deleted_at, added_by_id, type, loved_by_id, downloads) VALUES (2, 2, 'facebook', 3, '2022-08-18 17:55:05.183054', '2022-08-18 17:55:05.183054', NULL, 1, 'image', NULL, 0);
INSERT INTO public.asset (id, category_id, platform, media_id, created_at, updated_at, deleted_at, added_by_id, type, loved_by_id, downloads) VALUES (3, 3, 'tiktok', 4, '2022-08-18 17:56:49.351743', '2022-08-18 17:56:49.351743', NULL, 1, 'image', NULL, 0);
INSERT INTO public.asset (id, category_id, platform, media_id, created_at, updated_at, deleted_at, added_by_id, type, loved_by_id, downloads) VALUES (1, 1, 'facebook', 2, '2022-08-18 00:22:28.452271', '2022-08-18 00:22:28.452271', NULL, 1, 'image', NULL, 3);
SELECT pg_catalog.setval('public.asset_id_seq', 3, true);
