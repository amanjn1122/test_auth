// // pages/api/auth/logout.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { destroyCookie } from 'nookies'; // nookies for cookie manipulation

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       // Destroy the cookie that stores the JWT token
//       destroyCookie({ res }, "token", { path: "/" });
//       return res.status(200).json({ message: "Logged out successfully" });
//     } catch (error) {
//       console.error("Logout error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   } else {
//     return res.status(405).json({ message: "Method Not Allowed. Use POST." });
//   }
// }
