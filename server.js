import app from "./app.js";
import { PORT } from "./src/config/config.js";

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});
