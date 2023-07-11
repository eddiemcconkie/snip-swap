DEFINE TABLE follows SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE in = $auth
        AND $scope != 'extension'
;

DEFINE FIELD in ON follows
  TYPE record(auth_user)
  -- ASSERT $scope = NONE OR $value = $auth
;
DEFINE FIELD out ON follows
  TYPE record(auth_user)
  -- ASSERT $value != $auth
;

DEFINE INDEX unique_relation ON follows COLUMNS in, out UNIQUE;

  