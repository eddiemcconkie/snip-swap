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
