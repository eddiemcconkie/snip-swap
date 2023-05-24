DEFINE TABLE auth_user SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create, update, delete
      NONE
;
DEFINE FIELD username ON auth_user
  TYPE string
  ASSERT $value != NONE
;
DEFINE FIELD name ON auth_user
  TYPE string
  ASSERT $value != NONE
;
DEFINE FIELD avatar ON auth_user
  TYPE string
  ASSERT $value != NONE
;
DEFINE FIELD joined ON auth_user
  TYPE datetime
  VALUE $before OR time::now()
;

DEFINE SCOPE user SESSION 30d
  SIGNIN (SELECT VALUE user_id.* FROM type::thing('auth_session', $sessionId))
;
CREATE user:public;
DEFINE SCOPE public SESSION 30d
  SIGNIN (SELECT * FROM user:public)
;
