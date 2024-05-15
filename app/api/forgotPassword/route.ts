import { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "../../../src/xata";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const xata = getXataClient();      


export async function POST(req: Request, res: NextApiResponse) {
    try {
        const { username, secretCode } = await req.json();
        console.log("Received request with username:", username, "and secretCode:", secretCode);

        const user = await xata.db.Credentials.filter('username', username as string).getFirst();
        console.log("User found:", user);

        if (user && user.secretcode === secretCode) {
            console.log("User validated successfully.");
            const cookieStore = cookies();

            const fiveMinutes = 5 * 60 * 1000;
            const expirationDate = new Date(Date.now() + fiveMinutes);

            cookieStore.set('user', username, { expires: expirationDate }); //set the expiration to five Minutes
            return NextResponse.json({ message: "Successful validating user" }, { status: 200 });
        } else {
            console.log("Error validating user.");
            return NextResponse.json({ message: "Error validating user" }, { status: 404 });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json({ message: error }, { status: 400 });
    }
}