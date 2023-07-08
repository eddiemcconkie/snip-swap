DEFINE TABLE commented SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE in = $auth
;

DEFINE FIELD in ON commented
  TYPE record(auth_user)
  -- ASSERT $scope = NONE OR $value = $auth
;
DEFINE FIELD out ON commented
  TYPE record(snippet)
  -- ASSERT $value.public = true
;

DEFINE FIELD comment ON commented
  TYPE string
  ASSERT $value != NONE
; 
DEFINE FIELD time ON commented
  TYPE object
;
DEFINE FIELD time.created ON commented
  TYPE datetime
  VALUE $before OR time::now()
;
-- Updated should not be set when the record is first created
DEFINE FIELD time.updated ON commented
  TYPE datetime
  VALUE IF time.created < time::now() - 1s THEN time::now() ELSE NONE END
;
DEFINE FIELD time.since ON commented
  VALUE <future> { time::now() - time.created }
;
UPDATE commented SET time.since = <future> { time::now() - time.created };

-- Root can update owner. Otherwise, set owner to the current user
DEFINE FIELD owner ON commented
  TYPE record(auth_user)
  VALUE IF $scope != NONE THEN $before OR $auth ELSE $value END
  ASSERT $value != NONE
;
DEFINE FIELD mine ON commented
  VALUE <future> { owner = $auth }
;
UPDATE commented SET mine = <future> { owner = $auth };
