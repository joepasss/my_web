import express, {} from "express";
import cors from "cors";
import path from "path";
import { adminRouter, publicRouter } from "./routes";
import { PORT, SERVER_URL } from "./config.js";
import { sendResponse } from "./utils";
import { photoUploadDir } from "./middleware";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/files/photos", express.static(path.join(process.cwd(), photoUploadDir)));
app.use("/api/admin", adminRouter);
app.use("/api", publicRouter);
app.use((err, _, res, __) => {
    console.error("-------- GLOBAL ERROR --------");
    console.error(err.stack);
    if (err instanceof SyntaxError && "body" in err) {
        return sendResponse(res, 400, "Invalid JSON format", null);
    }
    sendResponse(res, 500, "Internal server error", null);
});
app.listen(PORT, () => {
    console.log(`server running on ${SERVER_URL}:${PORT}`);
});
//# sourceMappingURL=index.js.map