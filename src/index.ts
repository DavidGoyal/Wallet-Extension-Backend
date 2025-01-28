import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);
const prisma = new PrismaClient();

app.get("/token", async (req: Request, res: Response) => {
	try {
		const { address } = req.query;
		if (!address) {
			res.status(400).json({ success: false, error: "Address is required" });
			return;
		}

		const txn = await prisma.token.findFirst({
			where: {
				address: address as string,
			},
		});

		if (!txn) {
			res.status(404).json({ success: false, error: "Token not found" });
			return;
		}

		const data = {
			method: "getTransaction",
			jsonrpc: "2.0",
			id: "1",
			params: [
				txn.transaction,
				{
					encoding: "jsonParsed",
					commitment: "confirmed",
					maxSupportedTransactionVersion: 0,
				},
			],
		};

		const response = await fetch(
			"https://mainnet.helius-rpc.com/?api-key=e136916d-87a5-4dfe-87ab-0ba99d068979",
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const json = await response.json();
		res.status(200).json({
			success: true,
			txn: txn.transaction,
			creator: txn.creator,
			initialMint: txn.initialMint,
			createdAt: txn.createdAt,
			slot: json.result.slot,
		});
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
});

app.get("/txns", async (req: Request, res: Response) => {
	try {
		const { address } = req.query;
		if (!address) {
			res.status(400).json({ success: false, error: "Address is required" });
			return;
		}

		const txns = await prisma.transaction.findMany({
			where: {
				tokenAddress: address as string,
			},
		});

		res.status(200).json({ success: true, txns });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
});

app.listen(8000, () => {
	console.log("Server is running on port 8000");
});
