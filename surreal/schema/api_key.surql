DEFINE TABLE api_key SCHEMAFULL
  PERMISSIONS
    FOR create, update
      NONE
    FOR select, delete
      WHERE user_id = $auth
        AND $scope != 'extension'
;

-- HASHED KEY
DEFINE FIELD hashed_key ON api_key
  TYPE string
  VALUE crypto::argon2::generate($value)
  ASSERT $value != NONE
  PERMISSIONS NONE
;

-- PREFIX
DEFINE FIELD prefix ON api_key
  TYPE string
  ASSERT $value != NONE
;

-- TIME
DEFINE FIELD time ON api_key
  TYPE object
;

-- TIME CREATED: The time this API key was created
DEFINE FIELD time.created ON api_key
  TYPE datetime
  VALUE $before OR time::now()
;

-- TIME SINCE: How long it's been since the API key was created
DEFINE FIELD time.since ON api_key
  VALUE <future> { time::now() - time.created }
;
UPDATE api_key SET time.since = <future> { time::now() - time.created };

-- USER ID
DEFINE FIELD user_id ON api_key
  TYPE record(auth_user)
  ASSERT $value != NONE
;

DEFINE SCOPE extension SESSION 30d
  SIGNIN (SELECT VALUE user_id.* FROM api_key WHERE crypto::argon2::compare(hashed_key, $apiKey))
;
