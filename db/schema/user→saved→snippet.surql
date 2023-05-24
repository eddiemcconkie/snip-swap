DEFINE TABLE saved SCHEMAFULL
  PERMISSIONS
    FOR select
      FULL
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE in = $auth
;

DEFINE FIELD in ON saved
  TYPE record(auth_user)
  -- ASSERT $scope = NONE OR $value = $auth
;
DEFINE FIELD out ON saved
  TYPE record(snippet)
  -- ASSERT $value.public = true AND $value.owner != $auth
;
DEFINE FIELD collection ON saved
  TYPE record(collection)
;
