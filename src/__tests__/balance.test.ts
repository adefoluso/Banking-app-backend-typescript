import request from "supertest";
import app from "../app";

describe("*****Testing /api/balance POST*****", () => {
	it("throws an error when the user is not authenticated", async () => {
		const response = await request(app)
			.post("/api/balance")
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(401);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Login Required" });
	});

	it("throws an error for invalid input", async () => {
		const token = await (global as any).auth();

		const response = await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: "" })
			.expect(400);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "amount must be a number" });
	});

	it("successfully creates an account", async () => {
		const token = await (global as any).auth();

		const response = await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(201);

		expect(response.body).toHaveProperty("message");
		expect(response.body).toEqual({ message: "Deposit Successful" });
	});
});

describe("*****Testing /api/balance GET*****", () => {
	it("throws an error when the user is not authenticated", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(201);

		const response = await request(app).get("/api/balance").expect(401);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Login Required" });
	});

	it("returns all accounts for the authenticated user", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(201);

		const response = await request(app)
			.get("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body).toHaveProperty("data");
		expect(response.body).toHaveProperty("previous");
		expect(response.body).toHaveProperty("next");
		expect(response.body.data).not.toBeNull();
		expect(response.body.data).not.toBeUndefined();
	});
});

describe("*****Testing /api/balance/:accountNumber *****", () => {
	it("throws an error when the user is not authenticated", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(201);

		const response = await request(app)
			.get("/api/balance/1234567890")
			.expect(401);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "Login Required" });
	});

	it("returns individual account for the authenticated user", async () => {
		const token = await (global as any).auth();

		await request(app)
			.post("/api/balance")
			.set("Authorization", `Bearer ${token}`)
			.send({ accountNumber: "1234567890", amount: 1000000 })
			.expect(201);

		const response = await request(app)
			.get("/api/balance/1234567890")
			.set("Authorization", `Bearer ${token}`)
			.expect(200);

		expect(response.body).toHaveProperty("accountNumber");
		expect(response.body).toHaveProperty("amount");
		expect(response.body).toHaveProperty("owner");
		expect(response.body.accountNumber).not.toBeUndefined();
    expect(response.body.amount).not.toBeUndefined();
    expect(response.body.owner).not.toBeUndefined();
	});
});
