# Delete mongod.lock if it exists, then start MongoDB as a replica set
if (Test-Path "C:\data\db\mongod.lock") {
    Remove-Item "C:\data\db\mongod.lock"
}
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --replSet rs0 --dbpath "C:\data\db" 