DEFINE TABLE auth_session SCHEMALESS PERMISSIONS NONE;

DEFINE FIELD user_id ON auth_session TYPE record(auth_user) ASSERT $value != NONE;
DEFINE FIELD active_expires ON auth_session TYPE number ASSERT $value != NONE;
DEFINE FIELD idle_expires ON auth_session TYPE number ASSERT $value != NONE;
