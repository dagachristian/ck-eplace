CREATE TABLE IF NOT EXISTS ck_user (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  email text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT TRUE,
  default_locale text DEFAULT 'en',
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,

  created timestamp NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  last_modified timestamp NOT NULL DEFAULT now(),
  last_modified_by uuid NOT NULL
);
CREATE TABLE IF NOT EXISTS ck_canvas (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES ck_user,
  size number NOT NULL DEFAULT 20,
  timer number NOT NULL DEFAULT 0,
  img bytea,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,

  created timestamp NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  last_modified timestamp NOT NULL DEFAULT now(),
  last_modified_by uuid NOT NULL
);
CREATE TABLE IF NOT EXISTS ck_canvas_subs (
  user_id uuid REFERENCES ck_user,
  canvas_id uuid REFERENCES ck_canvas,
);