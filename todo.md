Good Read:
  1. Prisma$use (middleware on hook)

features:
  1. user can upload just only pictures without any caption                 DONE
  2. add tweet validation                                            UNNECESSARY
  3. implement airb&b style guide                                           DONE
  4. adding timestamps                                                      DONE
  5. get all my tweets                                               UNNECESSARY
  6. get my choosen tweets                                                  DONE
  7. get all my tweets in infinite scroll                                   DONE
  8. delete my tweets                                                       DONE
  9. updates my tweets                                        UNDER CONSTRUCTION
  10. delete photos when tweets is deleted                                   BUG
  11. delete single tweet idChild                             UNDER CONSTRUCTION
  12. use url query instead url parameter in update routes           UNNECESSARY
  13. when delete tweet, change id from request body to url param           DONE
  14. use /tweets for every single tweets endpoint                          DONE
  15. like a real twitter, split the first 140 character for 
      the parent tweet and, the rest is for the tweet child                                                   UNDER CONSTRUCTION

bug:
  1. DONE 
    when user not providing any caption, then prisma wont insert any data to
    database and it make tweetParent.id is undefined
  2. DONE
     1) if we adding tweets with tweet child, then tweet_parent query will not
     work because it only receive string, not array
     2) when adding tweets with tweet child, the first tweets in array that 
     should belong to tweet_parent, will be added to tweet_child too
  3. DONE
     infinite scroll is break, because now id is not a numeric value
     its uuid
  4. we actually can delete photos, but we can get the filename
  5. cannot uploaded multiple file multer

warning:
  1. we still do double checking when adding tweets                         DONE
  2. sending to many request to insert data                                 DONE
  3. there is no error handler if user not providing the requirements
  4. considering using nanoid instead uuid
  5. according to the best practice restful api, we should hiding the complexity
     from client, but when client is creating new tweets, we always expected an
     array, we should not do that instead, we will make that array in this server.

might help:
  1. read how infinite scroll work
  2. read infinite scroll performance
  3. read prisma documentation
  4. learn about swagger api to documenting your endpoint,
     because it geting more confusing                                       DONE
  5. learn database normalization, because sometimes it feels wierd

features details:
  7. its just get like around 10 tweets per load

features alternatives:
  7. using prisma pagination, offset will send through url params, but it will
  break the performance

how to fix:
  1. BUG 1 DONE
     1) read twitter architecture (it might help)
     2) read database normalization
     3) when user not providing any caption, we will still inserting
        null value to database, so we can get the tweetParent.id (temporary)
  2. WARNING 2 DONE 
      1) read prisma documentation on how create related records
        https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record 
      2) using prisma create related records
      3) change id property to string and generate in server not by database
  3. BUG 3 DONE
    1) creating 2 id columns                                          UNECESSARY
    2) read about nested create prisma, createMany etc
    3) its solved because actually we dont need uui for this operation,
    prisma will handle the relation value (id parent) when using nested create.
    recommend read it again
