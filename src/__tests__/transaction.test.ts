import request from "supertest";
import app from "../app";

describe("*****Testing /api/transactions POST*****", () => {
	it("throws an error when the user is not authenticated", async () => {
		const response = await request(app)
			.post("/api/transactions")
			.send({
				transferDescription: "data sub",
				amount: 10000,
				senderAccount: "1234567890",
				recieverAccount: "1234567891",
			})
			.expect(401);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Login Required" });
	});

	it("throws an error for invalid input parameters", async () => {
		const token = await (global as any).auth();

		const response = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				amount: 10000,
				senderAccount: "1234567890",
				recieverAccount: "1234567891",
			})
			.expect(400);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "transferDescription is required" });
	});

	it("throws an error when sender account does not have enough funds", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 100000 })
			.expect(201);

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567891", amount: 1000000 })
			.expect(201);

		const response = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				transferDescription: "data sub",
				amount: 110000,
				senderAccount: "1234567890",
				recieverAccount: "1234567891",
			})
			.expect(403);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Insufficient Funds" });
	});

	it("is a successful transfer", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 100000 })
			.expect(201);

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567891", amount: 1000000 })
			.expect(201);

		const response = await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				transferDescription: "data sub",
				amount: 100000,
				senderAccount: "1234567891",
				recieverAccount: "1234567890",
			})
			.expect(201);

		expect(response.body).toHaveProperty("message");
		expect(response.body).toEqual({ message: "Transfer successful" });
	});
});

describe("*****Testing /api/transactions GET*****", () => {
	it("throws an error if user is not authenticated", async () => {
		const response = await request(app).get("/api/transactions").expect(401);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Login Required" });
	});

	it("returns users trasactions if authenticated", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 100000 })
			.expect(201);

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567891", amount: 1000000 })
			.expect(201);

		await request(app)
			.post("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.send({
				transferDescription: "data sub",
				amount: 100000,
				senderAccount: "1234567891",
				recieverAccount: "1234567890",
			})
			.expect(201);

		const response = await request(app)
			.get("/api/transactions")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body).toHaveProperty("data");
		expect(response.body).toHaveProperty("previous");
		expect(response.body).toHaveProperty("next");
		expect(response.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					transferDescription: "data sub",
					amount: 100000,
					senderAccount: "1234567891",
					recieverAccount: "1234567890",
				}),
			])
		);
	});
});