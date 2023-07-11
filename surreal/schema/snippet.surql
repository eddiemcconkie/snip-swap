DEFINE TABLE snippet SCHEMAFULL
  PERMISSIONS
    FOR select
      WHERE public = true
      OR owner = $auth
    FOR create
      WHERE $scope = 'user'
    FOR update, delete
      WHERE owner = $auth
        AND $scope != 'extension'
;

-- CODE
DEFINE FIELD code ON snippet
  TYPE string
  ASSERT $value != NONE 
;

-- COLLECTION: The collection the snippet belongs to for the current user
DEFINE FIELD collection ON snippet
  VALUE <future> { <-saved[WHERE in = $auth].collection }
;
UPDATE snippet SET collection = <future> { <-saved[WHERE in = $auth].collection };

-- COMMENT COUNT: The number of comments on this snippet
DEFINE FIELD commentCount ON snippet
  VALUE <future> { count(<-commented) }
;
UPDATE snippet SET commentCount = <future> { count(<-commented) };

-- DESCRIPTION
DEFINE FIELD description ON snippet
  TYPE string
  ASSERT $value != NONE 
;

-- LANGUAGE
DEFINE FIELD language ON snippet
  TYPE record(language)
  ASSERT $value != NONE 
;

-- MINE: Whether the current user owns this snippet
DEFINE FIELD mine ON snippet
  VALUE <future> { owner = $auth }
;
UPDATE snippet SET mine = <future> { owner = $auth };

-- OWNER
DEFINE FIELD owner ON snippet
  TYPE record(auth_user)
  VALUE IF $scope != NONE THEN $before OR $auth ELSE $value END
    -- Root can update owner. Otherwise, set owner to the current user
  ASSERT $value != NONE
;

-- PUBLIC
DEFINE FIELD public ON snippet
  TYPE bool
  -- Once a snippet is made public, it can't be made private again
  VALUE IF $before = true THEN true ELSE $value OR true END
  ASSERT $value != NONE
;

-- SAVE COUNT: The number of times this snippet has been saved
DEFINE FIELD saveCount ON snippet
  VALUE <future> { count(<-saved) }
;
UPDATE snippet SET saveCount = <future> { count(<-saved) };

-- SAVED: Whether the current user has saved this snippet
DEFINE FIELD saved ON snippet
  VALUE <future> { count(<-saved[WHERE in = $auth.id]) > 0 }
;
UPDATE snippet SET saved = <future> { count(<-saved[WHERE in = $auth.id]) > 0 };

-- TIME
DEFINE FIELD time ON snippet
  TYPE object
;

-- TIME CREATED: The time this snippet was created
DEFINE FIELD time.created ON snippet
  TYPE datetime
  VALUE $before OR time::now()
;

-- TIME UPDATED: The last time this snippet was updated
DEFINE FIELD time.updated ON snippet
  TYPE datetime
  VALUE IF time.created < time::now() - 1s THEN time::now() ELSE NONE END
    -- Updated should not be set when the record is first created
;

-- TIME SINCE: How long it's been since the snippet was created
DEFINE FIELD time.since ON snippet
  VALUE <future> { time::now() - time.created }
;
UPDATE snippet SET time.since = <future> { time::now() - time.created };
