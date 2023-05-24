DEFINE TABLE snippet SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE public = true
      OR owner = $auth
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE owner = $auth
;

DEFINE FIELD code ON snippet
  TYPE string
  ASSERT $value != NONE 
;
DEFINE FIELD description ON snippet
  TYPE string
  ASSERT $value != NONE 
;
DEFINE FIELD language ON snippet
  TYPE record(language)
  ASSERT $value != NONE 
;
DEFINE FIELD time ON snippet
  TYPE object
;
DEFINE FIELD time.created ON snippet
  TYPE datetime
  VALUE $before OR time::now()
;
-- Updated should not be set when the record is first created
DEFINE FIELD time.updated ON snippet
  TYPE datetime
  VALUE IF time.created < time::now() - 1s THEN time::now() ELSE NONE END
;
-- Root can update owner. Otherwise, set owner to the current user
DEFINE FIELD owner ON snippet
  TYPE record(auth_user)
  VALUE IF $scope != NONE THEN $before OR $auth ELSE $value END
  ASSERT $value != NONE
;
DEFINE FIELD public ON snippet
  TYPE bool
  -- Once a snippet is made public, it can't be made private again
  VALUE IF $before = true THEN true ELSE $value OR true END
  ASSERT $value != NONE
;


