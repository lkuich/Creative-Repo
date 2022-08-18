SET check_function_bodies = false;
INSERT INTO public.media (id, key, remote_url, filename, mimetype, created_at, updated_at, deleted_at) VALUES (1, 'localhost/8d5edbd7-e08f-434e-9b2d-d175f8095b16', NULL, 'acacia_close_up.png', 'image/png', '2022-08-18 00:06:00.595263', '2022-08-18 00:06:00.595263', NULL);
INSERT INTO public.media (id, key, remote_url, filename, mimetype, created_at, updated_at, deleted_at) VALUES (2, 'localhost/8e2d0202-f574-4774-aa05-5fee78d39a90', NULL, 'acacia_full_body.png', 'image/png', '2022-08-18 00:21:52.648851', '2022-08-18 00:21:52.648851', NULL);
INSERT INTO public.media (id, key, remote_url, filename, mimetype, created_at, updated_at, deleted_at) VALUES (3, 'localhost/50a3bb25-b3f8-4a69-a5d9-8c6ddd9535b3', NULL, 'acorn_close_up.png', 'image/png', '2022-08-18 17:55:04.516954', '2022-08-18 17:55:04.516954', NULL);
INSERT INTO public.media (id, key, remote_url, filename, mimetype, created_at, updated_at, deleted_at) VALUES (4, 'localhost/e07652a1-7724-4243-a59f-2ce8f1f6d9a0', NULL, 'acorn_full_body.png', 'image/png', '2022-08-18 17:56:48.600877', '2022-08-18 17:56:48.600877', NULL);
SELECT pg_catalog.setval('public.media_id_seq', 4, true);
