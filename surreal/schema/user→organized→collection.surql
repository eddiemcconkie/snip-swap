DEFINE TABLE organized SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE owner = $auth
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE in = $auth
        AND $scope != 'extension'
;

DEFINE FIELD in ON organized
  TYPE record(auth_user)
  -- ASSERT $scope = NONE OR $value = $auth
;
DEFINE FIELD out ON organized
  TYPE record(collection)
  -- ASSERT $scope = NONE OR $value.owner = $auth
;

DEFINE INDEX unique_relation ON organized COLUMNS in, out UNIQUE;

