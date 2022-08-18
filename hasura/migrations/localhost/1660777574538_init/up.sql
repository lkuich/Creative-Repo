CREATE TYPE media_type AS ENUM ('video', 'image');
CREATE TYPE platform AS ENUM ('facebook', 'tiktok');

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  key text NOT NULL,
  remote_url text, -- Represent remote url of the media
  filename text NOT NULL,
  mimetype text,

  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,

  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp
);

CREATE TABLE asset (
  id SERIAL PRIMARY KEY,
  
  category_id integer NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id),

  platform platform NOT NULL,

  media_id integer NOT NULL,
  CONSTRAINT fk_media FOREIGN KEY (media_id) REFERENCES media(id),

  added_by_id integer NOT NULL,
  CONSTRAINT fk_added_by FOREIGN KEY (added_by_id) REFERENCES cr_user(id),

  type media_type NOT NULL DEFAULT 'image',

  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp
);

CREATE TABLE cr_user (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,

  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp
);
