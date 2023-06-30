DEFINE TABLE auth_key SCHEMAFULL PERMISSIONS NONE;

DEFINE FIELD user_id ON auth_key TYPE record(auth_user) ASSERT $value != NONE;
DEFINE FIELD primary_key ON auth_key TYPE bool ASSERT $value != NONE;
DEFINE FIELD hashed_password ON auth_key TYPE string;
DEFINE FIELD expires ON auth_key TYPE number;
