# ÍRIS v0.2

**ÍRIS** is an open-source pet management system that allows you to register, track, and manage your pets. It is currently under development and will have adoption features, medical history, daily tracking, and more in the future!

This repository only contains the back-end structure of the application - the repository containing the front-end is the following: https://github.com/StheffanyHadlich/iris-frontend

---

## Clone & Setup

Clone the repository and install the dependencies:

```bash
# Clone repository
$ git clone https://github.com/StheffanyHadlich/iris-foster-system.git

# Install dependencies
$ npm install

# Start database container
$ docker-compose up -d

# Run Prisma migrations
$ npx prisma migrate dev --name init

# Generate Prisma client
$ npx prisma generate

# Initiate API
$ npm run dev

# Visualize db tables
$ npx prisma studio
```

---

## Database

The project uses **PostgreSQL** as the database, managed with **Prisma ORM** and hosted in Docker Container.  
The backend service (running locally at `http://localhost:3000`) communicates with the database through Prisma.

The database is responsible for storing and managing the following information:

- **Pets personal data**
- **Medical history**
- **Adoption processes**
- **Adopter information**

---

## ENTITIES

**Pet**: Represents each registered animal.

**Adoptor**: Represents the person who adopted the animal or is interested.

**Daily**: All records regarding food, medications, weight, etc.

**Medical History**: All information regarding appointments, diagnoses, treatments, etc.

**Adoption**: Entity responsible for connecting the Pet and the Adopter.

---

## ATTRIBUTES

**User**

- id
- name
- email
- password
- creation_date

**Pets**:

- id (PK)
- name
- age
- type
- race
- current_weight
- photo_url
- status (available, up for adoption, adopted)
- registration_date

**Adopter**:

- id (PK)
- name
- email
- telephone
- address

**Daily**:

- id (PK)
- pets_id (FK-Pets.id)
- daily_date
- weight
- notes (free text)
- prescription_notes (free text)

**Medical History**

- id (PK)
- pets_id (FK-Pets.id)
- medical_date
- veterinarian
- diagnosis
- treatment
- prescription

**Adoption**

- id (PK)
- pets_id (FK-Pets.id)
- adopter_id (FK-Adoptor.id)
- start_Date
- end_Date (if applicable)
- status (Active, Completed, Canceled)

---

## RELATIONSHIPS

- Pet - Daily > 1:N
- Pet - Medical History > 1:N
- Pet - Adoption - Adopter > N:M

---

📌 Related Repositories

[Iris Frontend](https://github.com/StheffanyHadlich/iris-frontend) – REST API for managing pets, medical history, and adoption processes
