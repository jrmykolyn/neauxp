/*
 TODO:
- Get list of files to be committed.
- Get list of 'protected' files and 'banned' patterns.
- For each file to be committed:
-- Check for presence of file in 'protected' list.
-- Check for presence of 'banned' pattern in file.
-- If found, abort commit w/ a descriptive message.

MICROTASKS:
- Use Husky to collect list of files to be committed.
- Apply arbitrary glob or regex pattern to file list.
- Use Husky to abort commit.
*/
