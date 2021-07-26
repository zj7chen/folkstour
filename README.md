# FolksTour

Prisma

```
export DATABASE_URL="mysql://<user>:<password>@localhost:3306/tripdb"
npx prisma migrate dev --name init --preview-feature
npx prisma generate
```

## Database Invariant

- after the last `APPROVED` participation in a trip is deleted, there MUST NOT be any new `APPROVED` participation for that trip (relied on by `cancel-reservation`)
