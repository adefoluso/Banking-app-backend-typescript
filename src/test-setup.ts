import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "./app";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "tEsTsEcReT";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	collections.map(async (collection) => {
		await collection.deleteMany({});
	});
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

(global as any).auth = async () => {
  const fullName = "testUser"
	const email = "test@test.com";
	const password = "1234567";

	await request(app)
		.post("/auth/signup")
		.send({ fullName, email, password })
		.expect(201);

  const response = await request(app)
    .post("/auth/signin")
    .send({ email, password })
    .expect(200);

  return response.body.token;
};