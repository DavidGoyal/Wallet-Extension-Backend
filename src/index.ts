import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get("/txn", async (req: Request, res: Response) => {
	try {
		const { address } = req.body;
		if (!address) {
			res.status(400).json({ success: false, error: "Address is required" });
			return;
		}

		const txn = await prisma.token.findFirst({
			where: {
				address: address,
			},
		});

		if (!txn) {
			res.status(404).json({ success: false, error: "Token not found" });
			return;
		}
		res
			.status(200)
			.json({ success: true, txn: txn.transaction, creator: txn.creator });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
