# FolksTour

Prisma

```
export DATABASE_URL="mysql://<user>:<password>@localhost:3306/tripdb"
npx prisma migrate dev --name init --preview-feature
npx prisma generate
```

## Setup

Prereqs: `mysql-server`, `node` and `npm`

```bash
# first setup `mysql` and create database user `<user>` with password `<password>`
# install dependencies
npm install
# create env file
cat > .env.local <<EOF
DATABASE_URL="mysql://<user>:<password>@localhost:3306/tripdb"
EOF
# load env file
source .env.local
export DATABASE_URL
# initialize database
npx prisma migrate dev --name init --preview-feature
# generate RS256 (jwt signing) key pair
openssl genrsa -out private.key 4096
openssl rsa -in private.key -pubout > public.pem
# generate cities.json
./generate_cities.py
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm run start -- --port=80
```

## Database Invariant

- after the last `APPROVED` participation in a trip is deleted, there MUST NOT be any new `APPROVED` participation for that trip (relied on by `cancel-reservation`)
