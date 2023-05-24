DEFINE TABLE posted SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE in = $auth
;

DEFINE FIELD in ON posted
  TYPE record(auth_user)
  -- ASSERT $scope = NONE OR $value = $auth
;
DEFINE FIELD out ON posted
  TYPE record(snippet)
  -- ASSERT $scope = NONE OR $value.owner = $auth
;
