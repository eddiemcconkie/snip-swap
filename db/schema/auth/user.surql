DEFINE TABLE auth_user SCHEMALESS
  PERMISSIONS
    FOR select
      FULL
    FOR create, update, delete
      NONE
;
DEFINE FIELD username ON auth_user TYPE string;
DEFINE FIELD name ON auth_user TYPE string;
DEFINE FIELD avatar ON auth_user TYPE string;
DEFINE FIELD joined ON auth_user TYPE datetime VALUE IF $before THEN $before ELSE time::now() END;

DEFINE SCOPE user SESSION 30d
  SIGNIN (SELECT VALUE user_id.* FROM type::thing('auth_session', $sessionId))
;
CREATE user:public;
DEFINE SCOPE public SESSION 30d
  SIGNIN (SELECT * FROM user:public)
;
