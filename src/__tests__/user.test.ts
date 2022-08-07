import request from "supertest";
import app from "../app";

describe("*****Testing /auth/signup*****", () => {
	it("throws an error when fullName is not provided", async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send({ email: "test@test.com", password: "1234567" })
			.expect(400);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "fullName is required" });
	});

	it("throws an error for an invalid email", async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send({
				fullName: "testUser",
				email: "testtest.com",
				password: "1234567",
			})
			.expect(400);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({ error: "email must be a valid email" });
	});

	it("throws an error when password length is less than 7", async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send({
				fullName: "testUser",
				email: "test@test.com",
				password: "123456",
			})
			.expect(400);

		expect(response.body).toHaveProperty("error");
		expect(response.body).toEqual({
			error: "password length must be at least 7 characters long",
		});
	});

	it("is successful when given valid input parameters", async () => {
		const response = await request(app)
			.post("/auth/signup")
			.send({
				fullName: "testUser",
				email: "test@test.com",
				password: "1234567",
			})
			.expect(201);

		expect(response.body).toHaveProperty("message");
		expect(response.body).toEqual({ message: "Registration Complete" });
	});
});

describe("*****Testing /auth/signin*****", () => {
	it("signs in a user successfully", async () => {
		await (global as any).auth();

		const response = await request(app)
			.post("/auth/signin")
			.send({
				email: "test@test.com",
				password: "1234567",
			})
			.expect(200);

		expect(response.body).toHaveProperty("user");
		expect(response.body).toHaveProperty("token");
		expect(response.body.user).not.toBeNull();
		expect(response.body.token).not.toBeNull();
		expect(response.body.user).not.toBeUndefined();
		expect(response.body.token).not.toBeUndefined();
	});
});

describe("*****Testing /auth/signout*****", () => {
	it("signs out a user successfully", async () => {
		 const token = await (global as any).auth();

		const response = await request(app)
      .get("/auth/signout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

		expect(response.body).toHaveProperty("message");
		expect(response.body).toEqual({
			message: "signed out successfully",
		});
	});
});
