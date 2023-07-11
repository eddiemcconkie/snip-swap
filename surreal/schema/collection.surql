DEFINE TABLE collection SCHEMAFULL
  PERMISSIONS
    FOR create
      WHERE $scope = 'user'
    FOR select, update, delete
      WHERE owner = $auth
        AND $scope != 'extension'
;

DEFINE FIELD name ON collection  
  TYPE string
  ASSERT $value != NONE
;
DEFINE FIELD owner ON collection
  TYPE record(auth_user)
  VALUE IF $scope != NONE THEN $before OR $auth ELSE $value END
;

DEFINE INDEX unique_name ON collection COLUMNS name, owner UNIQUE;
