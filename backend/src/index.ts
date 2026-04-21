import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { adminRouter, publicRouter } from "@routes";
import { PORT, UPLOAD_ROOT } from "@config";
import { sendResponse } from "@utils";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/files", express.static(UPLOAD_ROOT));

app.use("/api/admin", adminRouter);
app.use("/api", publicRouter);

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error("-------- GLOBAL ERROR --------");
  console.error(err.stack);

  if (err instanceof SyntaxError && "body" in err) {
    return sendResponse(res, 400, "Invalid JSON format", null);
  }

  sendResponse(res, 500, "Internal server error", null);
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
